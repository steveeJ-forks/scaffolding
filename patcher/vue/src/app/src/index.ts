import { PatcherNodeType, PatcherDirectory } from '@patcher/types'; 

import { appVue } from './appVue';
import assets from './assets';
import components from './components';
import { envDTs } from './envDTs';
import { mainTs } from './mainTs';  

export default (): PatcherDirectory => ({
  type: PatcherNodeType.Directory,
  children: {
  'App.vue': appVue(),
  'assets': assets(),
  'components': components(),
  'env.d.ts': envDTs(),
  'main.ts': mainTs()
  }
})