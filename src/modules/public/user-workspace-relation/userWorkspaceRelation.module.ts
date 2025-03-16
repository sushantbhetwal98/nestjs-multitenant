import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWorkspaceRelation } from './entity/userWorkspaceRelation.entity';
import { UserWorkspaceRelationController } from './userWorkspaceRelation.controller';
import { UserWorkspaceRelationService } from './userWorkspaceRelation.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserWorkspaceRelation])],
  controllers: [UserWorkspaceRelationController],
  providers: [UserWorkspaceRelationService],
  exports: [UserWorkspaceRelationService],
})
export class UserWorkspaceRelationModule {}
