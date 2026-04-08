export { Comment } from './comment.entity';
export { Like } from './like.entity';
export { Video } from './video.entity';

export { Gathering } from './gathering.entity';
export { GatheringGenre } from './gathering-genre.entity';
export { GatheringParticipant } from './gathering-participant.entity';
export { GatheringSession } from './gathering-session.entity';
export { JammitUser } from './jammit-user.entity';
export { PreferredBandSession } from './preferred-band-session.entity';
export { PreferredGenre } from './preferred-genre.entity';
export { Review } from './review.entity';

import { Comment } from './comment.entity';
import { Gathering } from './gathering.entity';
import { GatheringGenre } from './gathering-genre.entity';
import { GatheringParticipant } from './gathering-participant.entity';
import { GatheringSession } from './gathering-session.entity';
import { JammitUser } from './jammit-user.entity';
import { Like } from './like.entity';
import { PreferredBandSession } from './preferred-band-session.entity';
import { PreferredGenre } from './preferred-genre.entity';
import { Review } from './review.entity';
import { Video } from './video.entity';

/** TypeORM / Jammit 도메인용 (모임·리뷰·선호 장르 등) */
export const JAMMIT_ENTITIES = [
  JammitUser,
  PreferredGenre,
  PreferredBandSession,
  Gathering,
  GatheringGenre,
  GatheringSession,
  GatheringParticipant,
  Review,
];

/** CLI dataSource·앱 전역 등록용 전체 엔티티 */
export const ALL_ENTITIES = [...JAMMIT_ENTITIES, Comment, Like, Video];
