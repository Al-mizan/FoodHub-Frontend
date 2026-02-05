import { Input } from "@/components/ui/input";
import Cuisines from "../../components/modules/homepage/cuisines";
import Dishes from "../../components/modules/homepage/dishes";
import Restaurants from "../../components/modules/homepage/restaurants";

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
