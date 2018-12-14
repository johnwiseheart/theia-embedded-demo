import { runApplication } from "./app";

const element = document.getElementById("react-container");
if (element != null) {
  runApplication(element);
}
