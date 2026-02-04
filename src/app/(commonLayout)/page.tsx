import { Input } from "@/components/ui/input";
import Cuisines from "./cuisines";
import Brands from "./brands";
import Dishes from "./dishes";

export default function Home() {
  return (
    <div>
      <Input placeholder="Enter text" />
      <Cuisines />
      <Brands />
      <Dishes />
    </div>
  );
}
