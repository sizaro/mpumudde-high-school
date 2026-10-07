import { PartialType } from '@nestjs/mapped-types';
import { CreateFinanceDto } from './create-finance.dto.js';

export class UpdateFinanceDto extends PartialType(CreateFinanceDto) {
  declare studentId?: string;
  declare studentTermFeeId?: string;
  declare studentChargeId?: string;
  declare amount?: number;
  declare method?: string;
  declare status?: string;
  declare description?: string;
  declare date?: string;
  declare financeStructureId?: string;
  declare feeTypeId?: string;
  declare transactionReference?: string;
  declare proofUrl?: string;
  declare proofFileName?: string;
}
