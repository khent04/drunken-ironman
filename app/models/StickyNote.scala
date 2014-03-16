package models

import anorm._
import play.api.db.DB
import anorm.SqlParser._
import play.api.libs.json._
import anorm.~
import anorm.Id
import play.api.libs.json.JsSuccess
import play.api.libs.json.JsObject
import play.api.libs.json.JsString
import play.api.libs.json.JsNumber
import play.api.Play.current
import org.joda.time._
import utils.AnormExtensions._
import org.joda.time.format.ISODateTimeFormat
import play.api.Logger

case class StickyNote(id: Pk[Long], text: String, createdAt: DateTime)

object StickyNote {

  val dateTimeFormatter = ISODateTimeFormat.dateTime()


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
      (json \ "createdAt").as[DateTime]
    ))

    def writes(stickyNote: StickyNote): JsValue = JsObject(Seq(
      "id" -> extractId(stickyNote),
      "text" -> JsString(stickyNote.text),
      "createdAt" -> JsString(dateTimeFormatter.print(stickyNote.createdAt.toDateTime(DateTimeZone.UTC))))
    )

  }


  private val stickyNoteRowParser = {
    get[Pk[Long]]("id") ~
      get[String]("text") ~
      get[DateTime]("created_at") map {
      case (id@Id(idValue)) ~ name ~ createdAt => {
        StickyNote(id, name, createdAt)
      }
    }
  }


  def findAll(): Seq[StickyNote] = {
    DB.withConnection {
      implicit connection =>
        SQL("SELECT * from sticky_notes").as(stickyNoteRowParser *)
    }
  }

  def create(): Option[Long] = {
    DB.withConnection {
      implicit connection =>
        SQL("INSERT INTO sticky_notes (text,created_at) VALUES ({text},NOW())").on('text -> "sticky note ;)").executeInsert()
    }
  }

  def save(stickyNote: StickyNote): Int = {
    DB.withConnection {
      implicit connection =>
        val q = SQL( """
              UPDATE sticky_notes SET
              text = {text},
              created_at = {created_at}
              WHERE id = {id}
             """).on('text -> stickyNote.text,'created_at -> stickyNote.createdAt, 'id -> stickyNote.id)

      Logger.logger.debug(q.sql.toString);

          q.executeUpdate()
    }
  }

  def deleteById(id: Long): Int = {
    DB.withConnection {
      implicit connection =>
        SQL( """
              DELETE FROM sticky_notes
              WHERE id = {id}
             """).on('id -> id).executeUpdate()
    }
  }


}
