
package controllers.api.rest

import play.api.mvc._
import play.api.libs.json._
import models.{StickyNote}
import scala.util.{Failure, Try, Success}
import scala.Some
import scala.util.Success
import scala.util.Failure
import play.api.libs.json.JsObject
import play.api.libs.json.JsString
import scala.math.BigDecimal
import scala.util.Success
import scala.util.Failure
import play.api.libs.json.JsObject
import play.api.libs.json.JsString
import play.api.mvc.SimpleResult
import play.api.libs.json.JsNumber
import play.api.Logger

object StickyNotes extends Controller {

  implicit def extractRequestUUID(implicit request: Request[_]): Option[String] = {
    request.headers.get("requestUUID")
  }

  implicit def stringToException(string: String): Exception = {
    new Exception(string)
  }

  implicit def tryOfStickyNoteToTryOfJsValue(tryOfStickyNote: Try[StickyNote]): Try[JsValue] = {
    tryOfStickyNote.map(Json.toJson(_))
  }

  implicit def okJsValue(t: Try[_]): Try[JsValue] = {
    t.map(_ => JsString("ok!"))
  }

  implicit def jsValueToOk(v: JsValue): SimpleResult = Ok(v)

  //TODO find a way to create a generic handler
  def HandelJsonRequest(f: Request[JsValue] => Try[JsValue])(implicit g: JsValue => SimpleResult): Action[JsValue] = {
    Action(parse.json) {
      request =>
        f(request) match {
          case Success(result) => g(result)
          case Failure(error) => InternalServerError(JsObject(Seq(
            "error" -> JsString(error.toString)
          )))
        }
    }
  }

  def HandelRequest(f: Request[AnyContent] => Try[JsValue])(implicit g: JsValue => SimpleResult): Action[AnyContent] = {
    Action {
      request =>
        f(request) match {
          case Success(result) => g(result)
          case Failure(error) => InternalServerError(JsObject(Seq(
            "error" -> JsString(error.toString)
          )))
        }
    }
  }


  def extractStickyNote(implicit request: Request[JsValue]): JsResult[StickyNote] = {
    request.body.validate[StickyNote]
  }

  def findAll = Action {
    request => Ok(Json.toJson(StickyNote.findAll()))
  }

  def create = HandelRequest {
    implicit request => StickyNote.create
  }

  def update = HandelJsonRequest {
    implicit request => {
      extractStickyNote
        .map(StickyNote.save)
        .getOrElse(Failure("Oops..."))
    }
  }

  def deleteById(id: Long) = HandelRequest(
    implicit request => {
      StickyNote.deleteById(id).map(JsBoolean(_))
    }
  )(result => result match {
    case JsBoolean(true) => Ok("...")
    case v => NotFound
  })


  def liveUpdate = WebSocket.async[JsValue] {

    request => {
      StickyNote.connectToLiveUpdate()
    }

  }


}

