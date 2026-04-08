-- ============================================================
-- JAMMIT 더미 유저 + 리뷰 시드
-- 실행 순서: gathering-seed.sql 실행 후 이 파일 실행
-- 실행: npm run seed:user-review
-- ============================================================

-- 1. 더미 유저 15명 삽입 (비밀번호: password - BCrypt)
-- 이미 존재하면 스킵 (ON CONFLICT)
INSERT INTO users (email, password, username, nickname, oauth_platform, created_at, updated_at)
VALUES
    ('dummy1@jammit.test', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '더미보컬', '보컬린이', 'NONE', NOW(), NOW()),
    ('dummy2@jammit.test', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '더미기타', '기타맨', 'NONE', NOW(), NOW()),
    ('dummy3@jammit.test', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '더미드럼', '드럼킹', 'NONE', NOW(), NOW()),
    ('dummy4@jammit.test', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '더미베이스', '베이시스트', 'NONE', NOW(), NOW()),
    ('dummy5@jammit.test', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '더미키보드', '키보디스트', 'NONE', NOW(), NOW()),
    ('dummy6@jammit.test', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '재즈러버', '재즈팬', 'NONE', NOW(), NOW()),
    ('dummy7@jammit.test', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '락러버', '락팬', 'NONE', NOW(), NOW()),
    ('dummy8@jammit.test', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '인디스피릿', '인디맨', 'NONE', NOW(), NOW()),
    ('dummy9@jammit.test', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '메탈헤드', '메탈러', 'NONE', NOW(), NOW()),
    ('dummy10@jammit.test', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '팝스타', '팝러버', 'NONE', NOW(), NOW()),
    ('dummy11@jammit.test', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '포크걸', '포크걸', 'NONE', NOW(), NOW()),
    ('dummy12@jammit.test', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '어쿠스틱러', '어쿠맨', 'NONE', NOW(), NOW()),
    ('dummy13@jammit.test', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '통기타맨', '통기타', 'NONE', NOW(), NOW()),
    ('dummy14@jammit.test', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '세션러버', '세션맨', 'NONE', NOW(), NOW()),
    ('dummy15@jammit.test', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '합주맨', '합주왕', 'NONE', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 2. 리뷰 시드 (COMPLETED 모임에 대해 더미 리뷰)
DO $$
DECLARE
    v_gathering RECORD;
    v_user_ids BIGINT[];
    v_reviewer_id BIGINT;
    v_reviewee_id BIGINT;
    v_content TEXT;
    v_contents TEXT[] := ARRAY[
        '함께 연주하니 정말 좋았어요! 다음에도 또 하고 싶습니다.',
        '실력이 좋으시고 분위기 메이커세요. 강추합니다.',
        '곡 준비 잘 해오셔서 합주가 수월했어요.',
        '다른 파트와 호흡이 정말 잘 맞으세요.',
        '연습 자료 공유 감사했습니다. 덕분에 많이 배웠어요.',
        '분위기 잘 이끌어주셔서 편하게 연주할 수 있었습니다.',
        '팀워크가 좋고 함께 연주하기 정말 편했어요.',
        '빨리 배워서 잘 따라와 주셔서 감사했습니다.',
        '시간 약속 잘 지키시고 책임감 있게 참여해 주셨어요.',
        NULL
    ];
    v_i INT;
    v_review_count INT := 0;
BEGIN
    -- 모든 유저 ID 수집 (song7022556 + 더미들)
    SELECT ARRAY_AGG(id ORDER BY id) INTO v_user_ids FROM users WHERE email LIKE '%@jammit%' OR email = 'song7022556@gmail.com';

    IF v_user_ids IS NULL OR array_length(v_user_ids, 1) < 2 THEN
        RAISE NOTICE '리뷰 작성에 필요한 유저가 2명 이상 없습니다. 더미 유저를 먼저 확인하세요.';
        RETURN;
    END IF;

    -- COMPLETED 모임마다 2~4개 리뷰 삽입
    FOR v_gathering IN SELECT id FROM gathering WHERE status = 'COMPLETED' LIMIT 30
    LOOP
        -- 각 COMPLETED 모임당 2~4개 리뷰
        FOR v_i IN 1..(2 + (v_gathering.id % 3)) LOOP
            -- reviewer ≠ reviewee 되도록 서로 다른 두 유저 선택
            v_reviewer_id := v_user_ids[1 + ((v_gathering.id + v_i) % array_length(v_user_ids, 1))];
            v_reviewee_id := v_user_ids[1 + ((v_gathering.id + v_i + 7) % array_length(v_user_ids, 1))];

            IF v_reviewer_id = v_reviewee_id THEN
                v_reviewee_id := v_user_ids[1 + ((v_reviewer_id - 1 + 1) % array_length(v_user_ids, 1))];
            END IF;

            v_content := v_contents[1 + ((v_gathering.id + v_i) % 10)];

            INSERT INTO review (
                content, is_practice_helped, is_good_with_music, is_good_with_others,
                is_shares_practice_resources, is_managing_well, is_helpful, is_good_learner, is_keeping_promises,
                reviewer_id, reviewee_id, gathering_id, created_at, updated_at
            ) VALUES (
                v_content,
                (v_i % 2) = 1,
                (v_i % 3) <> 0,
                true,
                (v_i % 2) = 0,
                (v_i % 3) = 1,
                true,
                (v_i % 2) = 1,
                true,
                v_reviewer_id,
                v_reviewee_id,
                v_gathering.id,
                NOW(),
                NOW()
            );
            v_review_count := v_review_count + 1;
        END LOOP;
    END LOOP;

    RAISE NOTICE '리뷰 % 개 삽입 완료', v_review_count;
END $$;
