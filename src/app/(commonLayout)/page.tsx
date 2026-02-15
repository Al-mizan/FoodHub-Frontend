import { Input } from "@/components/ui/input";
import Cuisines from "../../components/modules/homepage/Cuisines";
import Dishes from "../../components/modules/homepage/Dishes";
import Restaurants from "../../components/modules/homepage/Restaurants";

export default function Home() {
  return (
    <div>
      <Input placeholder="Search for restaurants or dishes or cuisines" />
      <Cuisines />
      <Restaurants />
      <Dishes />
    </div>
  );
}
