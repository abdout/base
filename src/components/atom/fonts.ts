import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Rubik } from "next/font/google"

export const fontSans = GeistSans

export const fontMono = GeistMono

export const fontRubik = Rubik({
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-rubik",
  display: "swap",
})
