-- ============================================================
-- JAMMIT Gathering Seed Data
-- 100개 밴드 모집 모임 데이터 (데드라인: 오늘 기준 50~60일 뒤)
-- 실행: JAMMIT_BE2 루트에서 npm run seed:gathering
-- created_by/updated_by: song7022556@gmail.com 유저 사용
-- ============================================================

DO $$
DECLARE
    v_user_id BIGINT;
    v_gathering_id BIGINT;
    v_i INT;
    v_name TEXT;
    v_description TEXT;
    v_place TEXT;
    v_thumbnail TEXT;
    v_gathering_dt TIMESTAMP;
    v_recruit_deadline TIMESTAMP;
    v_genre1 TEXT;
    v_genre2 TEXT;
    v_status TEXT;
    v_view_count INT;
BEGIN
    -- song7022556@gmail.com 유저 ID 조회
    SELECT id INTO v_user_id FROM users WHERE email = 'song7022556@gmail.com' LIMIT 1;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'email=song7022556@gmail.com 유저가 없습니다. 해당 유저를 먼저 생성하세요.';
    END IF;

    -- 밴드 모집 제목 풀
    FOR v_i IN 1..100 LOOP
        v_name := (ARRAY[
            '락 밴드 멤버 모집합니다', '재즈 세션 함께할 분', '팝 밴드 보컬/기타 구해요',
            '인디 밴드 새로운 팀원', '메탈 밴드 드러머 모집', '어쿠스틱 포크 세션',
            'R&B 세션 보컬 구함', '펑크 밴드 베이스 모집', '발라드 밴드 키보드',
            '얼터너티브 밴드 멤버', '포크 밴드 통기타리스트', '재즈 트리오 피아노',
            '록 밴드 리드 기타', '인디 록 보컬', '재즈 퀄텟 섹션',
            '팝 록 밴드 새 멤버', '메탈코어 밴드', '어쿠스틱 듀오',
            '팝 펑크 드러머', '재즈 빅밴드', '인디 포크 보컬',
            '하드록 기타리스트', '스윙 재즈', '모던 록 밴드',
            '얼터너티브 메탈', '어쿠스틱 트리오', '팝 발라드 세션',
            '재즈 퓨전 베이스', '인디 얼터니티브', '클래식 록 밴드',
            '재즈 컴보 세션', '팝 메탈 크로스오버', '포크 록 앙상블',
            'R&B 소울 세션', '얼터니티브 인디', '재즈 스탠다드',
            '팝펑크 밴드', '인디 팝 보컬', '재즈 보컬 스캣',
            '록 발라드 밴드', '어쿠스틱 포크 듀오', '메탈 블랙',
            '재즈 콰르텟', '팝 인디 크로스오버', '포크 메탈',
            'R&B 네오소울', '얼터니티브 록', '재즈 이스트 코스트',
            '락 발라드 퓨전', '인디 록 얼터니티브', '재즈 웨스트 코스트',
            '팝 R&B 믹스', '메탈 프로그레시브', '어쿠스틱 컨트리',
            '재즈 라틴 퓨전', '인디 포크 얼터니티브', '록 메탈',
            '재즈 컨템포러리', '팝 록 얼터니티브', '포크 블루스',
            'R&B 팝 크로스오버', '얼터니티브 팝', '재즈 스무스',
            '락 얼터니티브', '인디 재즈 퓨전', '재즈 하드밥',
            '팝 메탈 얼터니티브', '메탈 스래시', '어쿠스틱 재즈',
            '재즈 쿨', '인디 메탈', '록 하드코어',
            '재즈 바이밸브', '팝 인디 포크', '포크 컨트리',
            'R&B 컨템포러리', '얼터니티브 메탈', '재즈 포크',
            '락 포스트', '인디 R&B', '재즈 모달',
            '팝 얼터니티브', '메탈 헤비', '어쿠스틱 블루스',
            '재즈 비밥', '인디 포스트락', '록 얼터니티브',
            '재즈 콜 트레인', '팝 메탈 록', '포크 앨트',
            'R&B 얼터니티브', '얼터니티브 인디 록', '재즈 프리재즈',
            '락 그런지', '인디 그런지', '재즈 프리즘',
            '팝 그런지', '메탈 데스', '어쿠스틱 포크 록',
            '재즈 스윙', '인디 스윙', '록 포스트그런지',
            '재즈 컨템포', '팝 스윙', '포크 스윙',
            'R&B 재즈 퓨전', '얼터니티브 그런지', '재즈 스탠다드 발라드'
        ])[((v_i - 1) % 70) + 1];

        v_description := v_name || ' - ' || '음악을 사랑하는 분들과 함께 즐거운 합주를 만들어가요. 실력 무관 열정만 있으면 환영합니다!';

        v_place := (ARRAY[
            '서울 강남구', '서울 홍대', '서울 이태원', '서울 종로구', '서울 마포구',
            '서울 용산구', '서울 신촌', '부산 해운대', '대구 동성로', '인천 송도'
        ])[((v_i - 1) % 10) + 1];

        -- img_banner_01 ~ img_banner_12 순환
        v_thumbnail := 'img_banner_' || LPAD(((v_i - 1) % 12 + 1)::TEXT, 2, '0');

        -- recruit_deadline: 오늘 기준 50~60일 뒤 / gathering_datetime: 데드라인 이후 1~5일
        v_recruit_deadline := CURRENT_TIMESTAMP + (INTERVAL '1 day' * (50 + (v_i % 11)));
        v_gathering_dt := v_recruit_deadline + (INTERVAL '1 day' * (1 + (v_i % 5)));

        v_view_count := 30 + ((v_i * 7) % 200);
        -- status: RECRUITING, CONFIRMED, COMPLETED만 (CANCELED 없음)
        v_status := (ARRAY['RECRUITING', 'RECRUITING', 'CONFIRMED', 'COMPLETED'])[((v_i - 1) % 4) + 1];

        -- gathering 삽입
        INSERT INTO gathering (
            gathering_name, gathering_place, gathering_description, gathering_thumbnail,
            gathering_view_count, gathering_datetime, recruit_deadline, status,
            created_by, updated_by, created_at, updated_at
        ) VALUES (
            v_name, v_place, v_description, v_thumbnail,
            v_view_count, v_gathering_dt, v_recruit_deadline, v_status,
            v_user_id, v_user_id, NOW(), NOW()
        ) RETURNING id INTO v_gathering_id;

        -- gathering_genres 삽입 (1~2개 장르)
        v_genre1 := (ARRAY['ROCK','JAZZ','POP','INDIE','METAL','ACOUSTIC','RNB','PUNK','BALLAD','ALTERNATIVE','FOLK'])[((v_i - 1) % 11) + 1];
        v_genre2 := CASE WHEN (v_i % 3) = 0 THEN (ARRAY['METAL','ACOUSTIC','BALLAD','ALTERNATIVE','ROCK'])[((v_i/3) % 5) + 1] ELSE NULL END;

        INSERT INTO gathering_genres (gathering_id, genre_name) VALUES (v_gathering_id, v_genre1);
        IF v_genre2 IS NOT NULL AND v_genre2 != v_genre1 THEN
            INSERT INTO gathering_genres (gathering_id, genre_name) VALUES (v_gathering_id, v_genre2);
        END IF;

        -- gathering_session 삽입 (3개 세션: VOCAL, ELECTRIC_GUITAR, DRUM - 중복 없음)
        INSERT INTO gathering_session (gathering_id, band_session_name, recruit_count, current_count)
        VALUES
            (v_gathering_id, 'VOCAL', 1, LEAST(v_i % 2, 1)),
            (v_gathering_id, 'ELECTRIC_GUITAR', 1, v_i % 2),
            (v_gathering_id, 'DRUM', 1, (v_i % 3) / 2);
    END LOOP;

    RAISE NOTICE 'gathering 시드 100개 삽입 완료';
END $$;
