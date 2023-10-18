import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { User } from "./User";

@Index("UserId", ["UserId"], {})
@Entity("Feedback", { schema: "mydb" })
export class Feedback {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  Id: number;

  @Column("text", { name: "Text", nullable: true })
  Text: string | null;

  @Column("int", { name: "UserId", nullable: true })
  UserId: number | null;

  @Column("tinyint", { name: "IsDeleted", nullable: true, width: 1 })
  IsDeleted: boolean | null;

  @ManyToOne(() => User, (User) => User.Feedbacks, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "UserId", referencedColumnName: "Id" }])
  User: User;

  @RelationId((Feedback: Feedback) => Feedback.User)
  UserId2: number | null;
}
