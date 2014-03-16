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

case class StickyNote(id: Pk[Long], text: String)

object StickyNote {

  implicit object PkFormat extends Format[Pk[Long]] {
    def reads(json: JsValue): JsResult[Pk[Long]] = JsSuccess(
      json.asOpt[Long].map(id => Id(id)).getOrElse(NotAssigned)
    )

    def writes(id: Pk[Long]): JsValue = id.map(JsNumber(_)).getOrElse(JsNull)
  }

  implicit object StickyNoteFormat extends Format[StickyNote] {

    private def extractId(stickyNote: StickyNote): JsValue = {
      stickyNote.id match {
        case Id(id) => JsNumber(id)
        case NotAssigned => JsNull
      }
    }

    def reads(json: JsValue): JsResult[StickyNote] = JsSuccess(StickyNote(
      (json \ "id").as[Pk[Long]],
      (json \ "text").as[String]
    ))

    def writes(stickyNote: StickyNote): JsValue = JsObject(Seq(
      "id" -> extractId(stickyNote),
      "text" -> JsString(stickyNote.text)
    ))


  }


  private val stickyNoteRowParser = {
    get[Pk[Long]]("id") ~
      get[String]("text") map {
      case (id@Id(idValue)) ~ name => {
        StickyNote(id, name)
      }
    }
  }


  def findAll(): Seq[StickyNote] = {
    DB.withConnection {
      implicit connection =>
        SQL("SELECT * from sticky_notes").as(stickyNoteRowParser *)
    }
  }


}
