import { Controller } from '@nestjs/common';
import { UserWorkspaceRelationService } from './userWorkspaceRelation.service';

@Controller('user-workspace-rel')
export class UserWorkspaceRelationController {
  constructor(
    private readonly userWorkpsaceRelationService: UserWorkspaceRelationService,
  ) {}
}
