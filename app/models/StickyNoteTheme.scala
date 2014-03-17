package models

import play.api.libs.json._
import play.api.libs.json.JsObject
import play.api.libs.json.JsString

case class StickyNoteTheme(id: String, name: String)

object StickyNoteTheme {

  implicit object StickyNoteFormat extends Format[StickyNoteTheme] {

    def writes(theme: StickyNoteTheme): JsValue = JsObject(Seq(
      "id" -> JsString(theme.id),
      "name" -> JsString(theme.name)
    ))

    def reads(json: JsValue): JsResult[StickyNoteTheme] = ???
  }


  lazy val Themes = Seq(
    StickyNoteTheme("post-it", "Post-It"),
    StickyNoteTheme("blue", "Blue"),
    StickyNoteTheme("red", "Red"),
    StickyNoteTheme("green", "Green"),
    StickyNoteTheme("black", "Black")
  )

  lazy val JsonThemes = Json.toJson(Themes)

}
