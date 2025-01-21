import i18n from "i18next";
import { initReactI18next } from "react-i18next";

//EN
import enCommon from "../locals/en/common.json";
import enNavbar from "../locals/en/navbar.json";
import enMenu from "../locals/en/menu.json";
import enValidation from "../locals/en/validation.json";
import enApp from "../locals/en/app.json";
import enStatus from "../locals/en/status.json";
import enAuth from "../pages/auth/locals/en/auth.en.json";


// TH
import thCommon from "../locals/th/common.json";
import thNavbar from "../locals/th/navbar.json";
import thMenu from "../locals/th/menu.json";
import thValidation from "../locals/th/validation.json";
import thApp from "../locals/th/app.json";
import thStatus from "../locals/th/status.json";
import thAuth from "../pages/auth/locals/th/auth.th.json";




export const resources = {
	en: {
		common: enCommon,
		navbar: enNavbar,
		menu: enMenu,
		validation: enValidation,
		app: enApp,
		status: enStatus,
		auth:enAuth,

	},
	th: {
		common: thCommon,
		navbar: thNavbar,
		menu: thMenu,
		validation: thValidation,
		app: thApp,
		status: thStatus,
		auth:thAuth,

	},
};



i18n.use(initReactI18next).init({
  resources,
  lng: "th",
  // ns: ["common", "navbar", "menu", "validation","app","status","auth", "department","accessory"],
  defaultNS: "common",
  fallbackLng: "en",
  debug: true, // เพิ่มเพื่อช่วย debug
  interpolation: {
    escapeValue: false,
  },
});


export default i18n;
