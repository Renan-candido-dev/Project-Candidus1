import type {VideoSpec} from '../series/types';
import {v03} from './v03';
import {v04} from './v04';
import {v05} from './v05';
import {v07} from './v07';
import {v08} from './v08';
import {v09} from './v09';
import {v11} from './v11';
import {v12} from './v12';
import {v14} from './v14';
import {v15} from './v15';
import {v16} from './v16';
import {v17} from './v17';
import {v19} from './v19';
import {v22} from './v22';
import {v23} from './v23';
import {v24} from './v24';

// Vídeos produzidos pelo sistema da série (motion e demonstrações). O V01 está em ./v01.
export const SERIES: VideoSpec[] = [v03, v04, v05, v07, v08, v09, v11, v12, v14, v15, v16, v17, v19, v22, v23, v24];
