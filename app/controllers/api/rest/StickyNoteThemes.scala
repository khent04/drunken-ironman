package controllers.api.rest

import play.api.mvc.{Action, Controller}
import models.StickyNoteTheme._


object StickyNoteThemes extends Controller {

  def findAll = Action {
    request => Ok(JsonThemes)
  }

}
