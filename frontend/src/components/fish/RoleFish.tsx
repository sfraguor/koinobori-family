import type { RoleKind } from "../../types/fish";
import FatherFish from "./FatherFish";
import MotherFish from "./MotherFish";
import ChildFish from "./ChildFish";
import OtherFish from "./OtherFish";

export default function RoleFish({ kind }: { kind: RoleKind }) {
  switch (kind) {
    case "father": return <FatherFish kind="father" />;
    case "mother": return <MotherFish kind="mother" />;
    case "child":  return <ChildFish  kind="child"  />;
    default:       return <OtherFish  kind="other"  />;
  }
}
