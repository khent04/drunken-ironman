name := "stickies-part-2-back"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache
)

libraryDependencies += "postgresql" % "postgresql" % "9.1-901.jdbc4"

libraryDependencies += "joda-time" % "joda-time" % "2.0"

play.Project.playScalaSettings
