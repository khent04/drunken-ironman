
package models

import anorm._
import play.api.db.DB
import anorm.SqlParser._
import play.api.libs.json._
import play.api.Play.current
import org.joda.time._
import utils.AnormExtensions._
import play.api.libs.iteratee._
import akka.actor.{Props, Actor}
import play.libs.Akka
import akka.pattern.ask
import anorm.Id
import play.api.libs.json.JsSuccess
import play.api.libs.json.JsString
import play.api.libs.json.JsNumber
import anorm.~
import play.api.libs.json.JsObject
import akka.util.Timeout
import scala.concurrent.duration._
import scala.language.postfixOps

import play.api.Play.current
import play.api.libs.concurrent.Execution.Implicits._
import scala.util.{Failure, Try}
import play.api.Logger

case class StickyNote(id: Pk[Long], text: String, px: Int, py: Int, createdAt: DateTime, updatedAt: DateTime)

object StickyNote {


  implicit object StickyNoteFormat extends Format[StickyNote] {

    private def extractId(stickyNote: StickyNote): JsValue = {
      stickyNote.id match {
        case Id(id) => JsNumber(id)
        case NotAssigned => JsNull
      }
    }

    def reads(json: JsValue): JsResult[StickyNote] = JsSuccess(StickyNote(
      (json \ "id").as[Pk[Long]],
      (json \ "text").as[String],
      (json \ "px").as[Int],
      (json \ "py").as[Int],
      (json \ "createdAt").as[DateTime],
      (json \ "updatedAt").as[DateTime]
    ))

    def writes(stickyNote: StickyNote): JsValue = JsObject(Seq(
      "id" -> extractId(stickyNote),
      "text" -> JsString(stickyNote.text),
      "px" -> JsNumber(stickyNote.px),
      "py" -> JsNumber(stickyNote.py),
      "createdAt" -> JsNumber(stickyNote.createdAt.getMillis),
      "updatedAt" -> JsNumber(stickyNote.updatedAt.getMillis))
    )

  }


  private val stickyNoteRowParser = {
    get[Pk[Long]]("id") ~
      get[String]("text") ~
      get[Int]("px") ~
      get[Int]("py") ~
      get[DateTime]("created_at") ~
      get[DateTime]("updated_at") map {
      case (id@Id(idValue)) ~ name ~ px ~ py ~ createdAt ~ updatedAt => {
        StickyNote(id, name, px, py, createdAt, updatedAt)
      }
    }
  }


  def findAll(): List[StickyNote] = {
    DB.withConnection {
      implicit connection =>
        SQL("SELECT * from sticky_notes").as(stickyNoteRowParser *)
    }
  }

  def create(implicit requestUUID: Option[String]): Try[_] = {
    DB.withTransaction {
      implicit connection =>
        Try {
          val id = SQL("INSERT INTO sticky_notes (text,px,py,created_at,updated_at) VALUES ({text},0,0,NOW(),NOW())")
            .on('text -> "sticky note ;)").executeInsert()
          SQL("SELECT * from sticky_notes WHERE id = {id}")
            .on('id -> id)
            .as(stickyNoteRowParser.singleOpt).map {
            stickyNote =>
              liveUpdate ! Update(Json.obj(
                "requestUUID" -> JsString(requestUUID.getOrElse(null)),
                "type" -> "create",
                "stickyNote" -> Json.toJson(stickyNote)
              ))
          }
        }
    }
  }

  def save(stickyNote: StickyNote)(implicit requestUUID: Option[String]): Try[StickyNote] = {
    DB.withConnection {
      implicit connection =>
        Try {
          val now = new DateTime();

          val res = SQL( """
              UPDATE sticky_notes SET
              text = {text},
              px = {px},
              py = {py},
              created_at = {createdAt},
              updated_at = {updatedAt}
              WHERE id = {id}
                         """).on('text -> stickyNote.text,
            'px -> stickyNote.px,
            'py -> stickyNote.py,
            'createdAt -> stickyNote.createdAt, 'id -> stickyNote.id,
            'updatedAt -> now, 'id -> stickyNote.id).executeUpdate()

          val updatedStickyNote = stickyNote.copy(updatedAt = now)

          liveUpdate ! Update(Json.obj(
            "requestUUID" -> JsString(requestUUID.getOrElse(null)),
            "type" -> "update",
            "stickyNote" -> Json.toJson(updatedStickyNote)
          ))

          updatedStickyNote

        }
    }
  }

  def deleteById(id: Long)(implicit requestUUID: Option[String]): Try[Boolean] = {
    DB.withConnection {
      implicit connection =>
        Try {
          val i = SQL( """
              DELETE FROM sticky_notes
              WHERE id = {id}
                       """).on('id -> id).executeUpdate()
          if (i == 1) {
            liveUpdate ! Update(Json.obj(
              "requestUUID" -> JsString(requestUUID.getOrElse(null)),
              "type" -> "delete",
              "stickyNoteId" -> JsNumber(id)
            ))
            true
          } else false
        }
    }
  }

  lazy val liveUpdate = Akka.system.actorOf(Props[StickyNotesLiveUpdate])

  implicit val timeout = Timeout(1 second)

  def connectToLiveUpdate(): scala.concurrent.Future[(Iteratee[JsValue, _], Enumerator[JsValue])] = {
    (liveUpdate ? Connect()).map {
      case Connected(enumerator) =>

        // Create an Iteratee to consume the feed
        val iteratee = Iteratee.foreach[JsValue] {
          event =>
          //liveUpdate ! Update(event)
        }.map {
          _ =>
            liveUpdate ! ConnectionClosedByClient()
        }

        (iteratee, enumerator)

      case ConnectionError(error) =>
        val iteratee = Done[JsValue, Unit]((), Input.EOF)
        val enumerator = Enumerator[JsValue](JsObject(Seq("error" -> JsString(error)))).andThen(Enumerator.enumInput(Input.EOF))

        (iteratee, enumerator)

    }

  }


}

case class Connect()

case class Connected(enumerator: Enumerator[JsValue])

case class ConnectionError(msg: String)

case class ConnectionClosedByClient()

case class Update(event: JsValue)

class StickyNotesLiveUpdate extends Actor {

  val (liveUpdateEnumerator, liveUpdateChannel) = Concurrent.broadcast[JsValue]


  def receive: Actor.Receive = {
    case Connect() => {
      sender ! Connected(liveUpdateEnumerator)
    }
    case ConnectionClosedByClient() => {

    }
    case Update(event) => {
      liveUpdateChannel.push(event)
    }

  }
}


