package controllers.api.rest

import play.api.mvc.{Action, Controller}
import play.api.libs.json.{JsNumber, Json}
import models.StickyNote

object StickyNotes extends Controller {

  def findAll = Action {
    Ok(Json.toJson(StickyNote.findAll()))
  }

  def create = Action {
    StickyNote.create() match {
      case Some(id) => Ok(Json.toJson(Json.obj(
        "id" -> JsNumber(id)
      )))
      case _ => InternalServerError("")
    }
  }

  def update() = Action(parse.json) {
    request =>
      request.body.validate[StickyNote].map {
        stickyNote => {
          StickyNote.save(stickyNote)
          Ok("")
        }
      }.recoverTotal {
        e => BadRequest(e.toString)
      }
  }

  def deleteById(id: Long) = Action {
    StickyNote.deleteById(id) match {
      case 1 => Ok(Json.toJson("ok"))
      case _ => NotFound("")
    }
  }



}
