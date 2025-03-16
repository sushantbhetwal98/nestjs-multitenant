import { RESOURCE_ACTIONS, RESOURCES } from 'common/data/constants';

export interface PermissionInterface {
  id: string;
  resource: RESOURCES;
  actions: RESOURCE_ACTIONS[];
}
