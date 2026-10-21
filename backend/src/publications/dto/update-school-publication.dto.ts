import { PartialType } from "@nestjs/mapped-types";
import { CreateSchoolPublicationDto } from "./create-school-publication.dto.js";
export class UpdateSchoolPublicationDto extends PartialType(CreateSchoolPublicationDto) {}
