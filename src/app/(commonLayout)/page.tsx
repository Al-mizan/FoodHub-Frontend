import { Input } from "@/components/ui/input";
import Cuisines from "../../components/modules/homepage/cuisines";
import Brands from "../../components/modules/homepage/brands";
import Dishes from "../../components/modules/homepage/dishes";

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
