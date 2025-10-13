
import { Welcome } from "../components/welcome";

export function meta({}) {
  return [
    { title: "Nursing Home Admin Practice Exams" },
    //{ name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
