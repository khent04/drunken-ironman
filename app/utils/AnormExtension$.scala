package utils

import org.joda.time.format.{ISODateTimeFormat, DateTimeFormat, DateTimeFormatter}
import anorm._
import org.joda.time.DateTime
import play.api.libs.json._
import anorm.Id
import play.api.libs.json.JsSuccess
import anorm.TypeDoesNotMatch
import play.api.libs.json.JsNumber
import anorm.MetaDataItem
import play.api.Logger
import scala.util.Try

object AnormExtensions {

  val dateFormatGeneration: DateTimeFormatter = ISODateTimeFormat.dateTime();

  implicit def rowToDateTime: Column[DateTime] = Column.nonNull {
    (value, meta) =>
      val MetaDataItem(qualified, nullable, clazz) = meta
      value match {
        case ts: java.sql.Timestamp => Right(new DateTime(ts.getTime))
        case d: java.sql.Date => Right(new DateTime(d.getTime))
        case str: java.lang.String => Right(dateFormatGeneration.parseDateTime(str))
        case _ => Left(TypeDoesNotMatch("Cannot convert " + value + ":" + value.asInstanceOf[AnyRef].getClass))
      }
  }

  implicit val dateTimeToStatement = new ToStatement[DateTime] {
    def set(s: java.sql.PreparedStatement, index: Int, aValue: DateTime): Unit = {
      s.setTimestamp(index, new java.sql.Timestamp(aValue.withMillisOfSecond(0).getMillis()))
    }
  }


  implicit object PkFormatter extends Format[Pk[Long]] {
    def reads(json: JsValue): JsResult[Pk[Long]] = JsSuccess(
      json.asOpt[Long].map(id => Id(id)).getOrElse(NotAssigned)
    )

    def writes(id: Pk[Long]): JsValue = id.map(JsNumber(_)).getOrElse(JsNull)
  }

  implicit object DateTimeFormatter extends Format[DateTime] {
    def reads(json: JsValue): JsResult[DateTime] = try {
      JsSuccess(new DateTime(json.asOpt[Long].get))
    } catch {
      case e => JsError()
    }


    def writes(date: DateTime): JsValue = JsString(date.toString())
  }


}
