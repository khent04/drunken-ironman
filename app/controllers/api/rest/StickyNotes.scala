package controllers.api.rest

import play.api.mvc.{Action, Controller}
import play.api.libs.json.Json
import models.{StickyNote}

object StickyNotes extends Controller {

  def findAll = Action {
    Ok(Json.toJson(StickyNote.findAll()))
  }

}
