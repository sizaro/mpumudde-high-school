import { PartialType } from "@nestjs/mapped-types";
import { CreateSchoolEventDto } from "./create-school-event.dto.js";
export class UpdateSchoolEventDto extends PartialType(CreateSchoolEventDto) {}
