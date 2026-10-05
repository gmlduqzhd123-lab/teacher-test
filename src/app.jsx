// 초등교직논술 모의고사 — 화면 코드 원본(JSX)
// 이 파일을 고친 뒤 `npm run build`를 실행하면 app.js가 다시 만들어집니다. app.js는 직접 고치지 마세요.
    const { useState, useEffect, useRef, useMemo } = React;

    // --- [저장소] ---
    const KEYS = {
      session: 'essay_session_v2',
      history: 'essay_history_v2',
      settings: 'essay_settings_v2',
    };
    const store = {
      get(key, fallback) {
        try {
          const raw = localStorage.getItem(key);
          return raw == null ? fallback : JSON.parse(raw);
        } catch { return fallback; }
      },
      set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
      },
      remove(key) {
        try { localStorage.removeItem(key); } catch {}
      },
    };
    const HISTORY_LIMIT = 30;

    // --- [랜덤 키워드 DB] ---
    const EDUCATIONAL_KEYWORDS = [
      "과정 중심 평가", "학생 주도성", "늘봄학교", "기초학력 보장",
      "에듀테크 활용", "생태전환교육", "민주시민교육", "학습 부진 지도",
      "창의·융합 교육", "다문화 교육", "회복적 생활교육", "학교폭력 예방",
      "교육과정 자율화", "디지털 시민성", "학생 맞춤 통합지원", "교사 전문적 학습공동체"
    ];

    const TIME_OPTIONS = [
      { value: 3600, label: '60분 (실전)' },
      { value: 3000, label: '50분' },
      { value: 2400, label: '40분' },
      { value: 1800, label: '30분' },
      { value: 0, label: '시간 제한 없음' },
    ];

    // --- [논점 영역: 약점 분석과 자동 채점의 기준] ---
    const CATEGORY_CUES = {
      '개념·의의': ['의미', '의의', '필요', '중요', '효과', '가치', '목적'],
      '문제점·원인': ['문제', '한계', '원인', '어려움', '부족', '때문'],
      '교사 역할': ['역할', '교사는', '교사가', '안내자', '촉진자', '조력자'],
      '교수·학습 방안': ['수업', '교과', '활동', '프로젝트', '토의', '토론', '창의적 체험활동', '재구성'],
      '평가 방안': ['평가', '피드백', '관찰', '성찰', '포트폴리오', '루브릭'],
      '학급 경영': ['학급', '환경', '규칙', '분위기', '공간', '역할 분담', '자치'],
      '생활지도·상담': ['상담', '생활지도', '관계', '회복', '공감', '갈등'],
      '맞춤형 학습 지원': ['맞춤', '개별', '수준', '보충', '격차', '느린', '진단'],
      '학부모·공동체 협력': ['학부모', '가정', '지역', '공동체', '소통', '협력', '동료'],
      '정책·제도 이해': ['정책', '제도', '법', '교육과정', '지침', '운영'],
    };

    const CATEGORY_TIPS = {
      '개념·의의': "개념을 한 문장으로 정의한 뒤 '첫째, 둘째'로 의의를 구분해 쓰세요.",
      '문제점·원인': '지문 속 단서(누가, 무엇을 겪는지)를 직접 짚어 문제점을 쓰세요.',
      '교사 역할': "'교사는 ~하는 역할을 한다' 형태로 역할을 분명히 명시하세요.",
      '교수·학습 방안': '교과·차시·활동 이름이 드러나게 구체적인 수업 장면으로 쓰세요.',
      '평가 방안': '평가 시기·방법·피드백을 함께 제시하면 구체성이 올라갑니다.',
      '학급 경영': '교실 공간, 규칙, 학급 자치 등 실행 가능한 장치를 제시하세요.',
      '생활지도·상담': '학생 개별 상황에 맞춘 단계적 지도 방법을 제시하세요.',
      '맞춤형 학습 지원': '진단 → 지원 → 점검의 흐름으로 방안을 제시하세요.',
      '학부모·공동체 협력': '소통 채널과 시기, 교사가 유의할 점을 함께 쓰세요.',
      '정책·제도 이해': '정책의 취지와 학교 현장 적용 방안을 연결하세요.',
    };

    const PASSAGE_HINTS = {
      '개념·의의': (t) => `요즘 '${t}'이(가) 많이 강조되는데, 정확히 어떤 의미이고 왜 필요한지는 선생님들마다 생각이 조금씩 다른 것 같아요.`,
      '문제점·원인': (t) => `작년에 '${t}' 관련 활동을 해 봤는데, 행사처럼 한 번 하고 끝나서 학생들의 실제 변화로는 이어지지 않았어요.`,
      '교사 역할': () => `결국 교사가 어떤 역할을 해야 하는지가 핵심인 것 같아요. 예전처럼 지식을 전달하는 것만으로는 부족하겠죠.`,
      '교수·학습 방안': () => `교과 시간에 어떻게 녹여 낼지가 가장 고민이에요. 따로 떼어 운영하면 학생들이 부담만 느끼더라고요.`,
      '평가 방안': () => `결과만 보는 평가로는 학생이 어떻게 성장했는지 알기 어렵다는 이야기가 많아요. 평가 방식도 함께 바꿔야 할 것 같아요.`,
      '학급 경영': () => `저는 수업만큼 교실 분위기와 학급 규칙이 중요하다고 봐요. 학생들이 하루 대부분을 보내는 공간이니까요.`,
      '생활지도·상담': () => `우리 반에도 도움이 더 필요한 학생이 있는데, 모두에게 같은 방식으로 지도하는 것이 맞는지 모르겠어요.`,
      '맞춤형 학습 지원': () => `같은 반 안에서도 학습 속도 차이가 커서, 느린 학생들이 점점 수업에서 멀어지는 게 보여요.`,
      '학부모·공동체 협력': () => `가정과 협력하지 않으면 효과가 오래가지 않더라고요. 학부모님, 동료 선생님들과 어떻게 함께할지도 정해야 해요.`,
      '정책·제도 이해': (t) => `'${t}' 관련 운영 지침이 내려왔는데, 취지는 좋지만 우리 학교 여건에 맞게 어떻게 적용할지가 막막해요.`,
    };

    // --- [문항 세트: 매번 같은 문제가 나오지 않도록 여러 구조를 둔다] ---
    const QUESTION_SETS = [
      (t) => [
        { label: '의의와 교사의 역할', task: `'${t}'의 교육적 의의 2가지와 이를 위해 교사에게 요구되는 역할 2가지`, score: 4, category: '개념·의의', need: 4 },
        { label: '교과·창체 연계 지도', task: `교과 수업과 창의적 체험활동을 연계한 지도 방안 각각 1가지`, score: 4, category: '교수·학습 방안', need: 2 },
        { label: '학급 환경 조성', task: `학급 경영 측면에서 관련 역량 함양을 돕는 환경 조성 방안 2가지`, score: 4, category: '학급 경영', need: 2 },
        { label: '학부모 상담 유의점', task: `학부모 상담 시 교사가 유의해야 할 점 3가지`, score: 3, category: '학부모·공동체 협력', need: 3 },
      ],
      (t) => [
        { label: '운영상의 문제점', task: `대화에 드러난 '${t}' 운영상의 문제점 2가지`, score: 3, category: '문제점·원인', need: 2 },
        { label: '개선을 위한 수업 방안', task: `문제점을 개선하기 위한 교수·학습 방안 2가지`, score: 4, category: '교수·학습 방안', need: 2 },
        { label: '평가와 피드백', task: `과정 중심 평가 관점에서의 평가 방안 2가지와 피드백 방법 1가지`, score: 4, category: '평가 방안', need: 3 },
        { label: '교사 공동체 협력', task: `교사 학습공동체 차원의 협력 방안 2가지`, score: 4, category: '학부모·공동체 협력', need: 2 },
      ],
      (t) => [
        { label: '개념과 필요성', task: `'${t}'의 의미와 필요성 2가지`, score: 3, category: '개념·의의', need: 3 },
        { label: '교육과정 재구성', task: `교과 내 또는 교과 간 교육과정 재구성 방안 2가지`, score: 4, category: '교수·학습 방안', need: 2 },
        { label: '학생 특성별 생활지도', task: `학생의 개별 특성을 고려한 생활지도 방안 2가지`, score: 4, category: '생활지도·상담', need: 2 },
        { label: '가정·지역 연계', task: `가정 및 지역사회와의 연계 방안 2가지`, score: 4, category: '학부모·공동체 협력', need: 2 },
      ],
      (t) => [
        { label: '교사의 역할', task: `'${t}'을(를) 위해 교사에게 요구되는 역할 3가지`, score: 3, category: '교사 역할', need: 3 },
        { label: '디지털 도구 활용 수업', task: `디지털 도구를 활용한 수업 방안 2가지와 활용 시 유의점 1가지`, score: 4, category: '교수·학습 방안', need: 3 },
        { label: '학습 격차 지원', task: `학습 속도가 느린 학생을 위한 맞춤형 지원 방안 2가지`, score: 4, category: '맞춤형 학습 지원', need: 2 },
        { label: '정책의 현장 적용', task: `관련 정책의 취지를 학교 여건에 맞게 적용하는 방안 2가지`, score: 4, category: '정책·제도 이해', need: 2 },
      ],
    ];

    // --- [지문 형식: 협의회 대화 / 성찰 일지 / 회의록] ---
    const TEACHERS = ['김 교사', '박 교사', '이 교사', '최 교사', '정 교사'];
    const PASSAGE_FORMATS = [
      {
        name: '교사 협의회 대화',
        intro: '교사들이 나눈 대화의 일부',
        build: (t, qs) => [
          { speaker: TEACHERS[0], text: `내년도 교육과정 운영 계획에 '${t}'을(를) 반영하려고 하는데, 선생님들 생각을 들어 보고 싶어요.` },
          ...qs.map((q, i) => ({ speaker: TEACHERS[(i + 1) % TEACHERS.length], text: PASSAGE_HINTS[q.category](t) })),
          { speaker: TEACHERS[0], text: `오늘 나온 이야기를 바탕으로 우리 학년에서 실천할 방안을 구체적으로 정리해 봅시다.` },
        ],
      },
      {
        name: '초임 교사의 성찰 일지',
        intro: '초임 교사가 작성한 성찰 일지의 일부',
        build: (t, qs) => [
          { speaker: '', text: `올해 '${t}'을(를) 학급에서 실천해 보겠다고 다짐했지만, 한 학기를 돌아보니 아쉬운 점이 많다.` },
          ...qs.map((q, i) => ({ speaker: '', text: `${TEACHERS[(i + 1) % TEACHERS.length]}의 말이 계속 마음에 남는다. “${PASSAGE_HINTS[q.category](t)}”` })),
          { speaker: '', text: `2학기에는 선배 교사들의 조언을 참고하여 무엇을 바꿀지 구체적으로 계획해야겠다.` },
        ],
      },
      {
        name: '학년 협의회 회의록',
        intro: '학년 협의회 회의록의 일부',
        build: (t, qs) => [
          { speaker: '(가)', text: `안건: 2학기 '${t}' 운영 방안 협의` },
          ...qs.map((q, i) => ({ speaker: `(${'나다라마바'[i]})`, text: PASSAGE_HINTS[q.category](t) })),
        ],
      },
    ];

    const GUIDELINES = [
      "주어진 답안지 면수(2매 이내)에 맞게 서술하시오.",
      "글의 체계를 논리적으로 짜임새 있게 구성하시오.",
      "글의 명료성, 타당성, 일관성을 고려하여 서술하시오.",
    ];
    const FORMAT_ITEMS = [
      { text: "글의 논리적 체계성", score: 3 },
      { text: "맞춤법 및 어휘·문장의 적절성", score: 2 },
    ];

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

    const generateTemplateExam = (topic) => {
      const questions = pick(QUESTION_SETS)(topic).map((q, i) => ({ ...q, id: i + 1 }));
      const format = pick(PASSAGE_FORMATS);
      return {
        id: newId(),
        topic,
        title: `[${topic}] 초등교직논술 모의고사`,
        problem: `다음은 ○○초등학교 ${format.intro}이다. 이를 바탕으로 '${topic}'에 대하여 [배점]에 제시된 내용을 모두 포함하여 논하시오. [총 20점]`,
        passageTitle: format.name,
        passage: format.build(topic, questions),
        questions,
      };
    };

    const contentTotal = (exam) => exam.questions.reduce((s, q) => s + q.score, 0);

    // --- [텍스트 분석 도구] ---
    const MARKER_RE = /(첫째|둘째|셋째|넷째|먼저|다음으로|또한|마지막으로|①|②|③|④|\b[1-4]\)|또 다른)/g;
    const splitSentences = (text) =>
      text.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
    const splitParagraphs = (text) =>
      text.split(/\n+/).map((p) => p.trim()).filter((p) => p.replace(/\s/g, '').length >= 15);
    const noSpaceLength = (text) => text.replace(/\s/g, '').length;

    const cuesFor = (q) => {
      const fromLabel = q.label.split(/[·\s]/).filter((w) => w.length >= 2);
      return [...(CATEGORY_CUES[q.category] || []), ...fromLabel];
    };

    const matchQuestion = (q, sentences) => {
      const cues = cuesFor(q);
      return sentences.filter((s) => cues.some((c) => s.includes(c)));
    };

    const detectPadding = (text) => {
      const words = text.split(/\s+/).filter(Boolean);
      const sentences = splitSentences(text);
      if (words.length < 20) return false;
      const wordRatio = new Set(words).size / words.length;
      const sentRatio = sentences.length ? new Set(sentences).size / sentences.length : 1;
      return wordRatio < 0.3 || sentRatio < 0.5;
    };

    // --- [자동 채점: 키워드·단락·분량으로 추정하는 참고용 채점] ---
    const evaluateSimple = (answer, exam) => {
      const text = answer.trim();
      const length = noSpaceLength(text);
      const sentences = splitSentences(text);
      const paragraphs = splitParagraphs(text);
      const padded = detectPadding(text);
      const shortFactor = length < 300 ? 0.5 : 1;

      const items = exam.questions.map((q) => {
        const matched = matchQuestion(q, sentences);
        const markers = matched.join(' ').match(MARKER_RE) || [];
        const found = Math.min(q.need, Math.max(markers.length, Math.floor(matched.length / 2)));
        const coverage = padded || matched.length === 0 ? 0 : Math.max(found, 1) / q.need;
        const earned = Math.round(q.score * Math.min(1, coverage) * shortFactor * 2) / 2;
        const verdict = earned >= q.score ? '충족' : earned > 0 ? '부분 충족' : '미충족';
        return {
          id: q.id,
          label: q.label,
          category: q.category,
          max: q.score,
          earned,
          verdict,
          evidence: matched[0] ? (matched[0].length > 90 ? matched[0].slice(0, 90) + '…' : matched[0]) : '',
          missing: matched.length === 0
            ? '이 논점과 관련된 문장을 찾지 못했습니다.'
            : found < q.need ? `요구 ${q.need}가지 중 약 ${found}가지만 확인됩니다.` : '',
          suggestion: CATEGORY_TIPS[q.category] || '',
        };
      });

      const markerTotal = (text.match(MARKER_RE) || []).length;
      let structureScore = 0;
      if (paragraphs.length >= 3) structureScore++;
      if (paragraphs.length >= 4) {
        const first = noSpaceLength(paragraphs[0]);
        const last = noSpaceLength(paragraphs[paragraphs.length - 1]);
        if (first <= length * 0.25 && last <= length * 0.25) structureScore++;
      }
      if (markerTotal >= 2) structureScore++;
      if (length < 300) structureScore = Math.min(structureScore, 1);

      const politeEndings = sentences.filter((s) => /(요|니다)[.!?]?$/.test(s)).length;
      const avgLen = sentences.length ? length / sentences.length : 0;
      let expressionScore = 0;
      if (sentences.length && politeEndings / sentences.length < 0.2) expressionScore++;
      if (avgLen >= 20 && avgLen <= 110) expressionScore++;

      if (padded) { structureScore = 0; expressionScore = 0; }

      const contentScore = items.reduce((s, i) => s + i.earned, 0);
      const improvements = [];
      if (padded) improvements.push('같은 단어나 문장을 반복한 부분이 많습니다. 분량보다 논점별 내용이 중요합니다.');
      if (length < 1000) improvements.push(`분량이 공백 제외 ${length}자입니다. 논점을 빠짐없이 다루려면 1,000자 이상이 필요합니다.`);
      if (paragraphs.length < 4) improvements.push('서론 - 논점별 본론 단락 - 결론으로 단락을 나누세요.');
      if (sentences.length && politeEndings / sentences.length >= 0.2) improvements.push("'~요/~니다' 대신 논술체('~다')로 쓰세요.");
      if (!text.includes(exam.topic)) improvements.push(`주제어 '${exam.topic}'을(를) 서론과 결론에서 명시하세요.`);
      items.filter((i) => i.verdict !== '충족').forEach((i) => improvements.push(`[${i.label}] ${i.suggestion}`));

      return {
        contentScore,
        formatScore: structureScore + expressionScore,
        total: contentScore + structureScore + expressionScore,
        items,
        format: {
          structureScore,
          expressionScore,
          structureComment: padded
            ? '반복 문장이 많아 체계를 평가할 수 없습니다.'
            : `단락 ${paragraphs.length}개, 열거 표지(첫째·둘째 등) ${markerTotal}개가 확인됩니다.`,
          expressionComment: padded
            ? '반복 문장이 많아 표현을 평가할 수 없습니다.'
            : `문장 ${sentences.length}개, 평균 ${Math.round(avgLen)}자이며 경어체 문장이 ${politeEndings}개입니다.`,
        },
        overall: padded
          ? '반복되는 문장이나 단어로 분량을 채운 답안으로 판단되어 점수를 부여하지 않았습니다.'
          : '자동 채점은 키워드·단락·분량으로 추정한 참고용 점수입니다. 내용의 타당성과 구체성은 스터디원이나 선배 교사의 첨삭으로 확인하세요.',
        improvements,
      };
    };

    // --- [공통 유틸] ---
    const formatTime = (seconds) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
    };
    const formatDate = (ts) => {
      const d = new Date(ts);
      return `${d.getMonth() + 1}.${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    };
    const dDay = (dateStr) => {
      if (!dateStr) return null;
      const target = new Date(dateStr + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diff = Math.round((target - today) / 86400000);
      if (Number.isNaN(diff)) return null;
      return diff > 0 ? `D-${diff}` : diff === 0 ? 'D-DAY' : `D+${-diff}`;
    };
    const outlineTemplate = (exam) => [
      '서론: ',
      ...exam.questions.map((q) => `본론 ${q.id} [${q.label}] (${q.need}가지): `),
      '결론: ',
    ].join('\n');

    const remainingOf = (session, now) => {
      if (!session.duration) return null;
      if (session.paused) return session.pausedRemaining;
      return Math.max(0, Math.ceil((session.deadline - now) / 1000));
    };

    // --- [작은 UI 조각] ---
    const Card = ({ className = '', children }) => (
      <div className={`bg-surface rounded-3xl shadow-sm border border-slate-100 ${className}`}>{children}</div>
    );

    const Badge = ({ tone = 'slate', children }) => {
      const tones = {
        slate: 'bg-slate-100 text-slate-600',
        indigo: 'bg-indigo-50 text-primary',
        green: 'bg-emerald-50 text-emerald-700',
        amber: 'bg-amber-50 text-amber-700',
        rose: 'bg-rose-50 text-rose-600',
      };
      return <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${tones[tone]}`}>{children}</span>;
    };

    const verdictTone = (v) => (v === '충족' ? 'green' : v === '부분 충족' ? 'amber' : 'rose');

    function Toasts({ toasts }) {
      return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 space-y-2 w-[calc(100%-32px)] max-w-md">
          {toasts.map((t) => (
            <div key={t.id} className={`px-5 py-3 rounded-xl shadow-lg text-sm font-bold text-white ${t.tone === 'warn' ? 'bg-rose-500' : 'bg-slate-800'}`}>
              {t.text}
            </div>
          ))}
        </div>
      );
    }

    function SettingsModal({ settings, onSave, onClose }) {
      const [examDate, setExamDate] = useState(settings.examDate || '');
      return (
        <div className="fixed inset-0 z-40 bg-slate-900/40 flex items-center justify-center p-4" onClick={onClose}>
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg space-y-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-extrabold">설정</h2>
            <div className="space-y-2">
              <label className="block font-bold text-slate-700">시험일 (D-day 표시)</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100">취소</button>
              <button
                onClick={() => onSave({ ...settings, examDate })}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primaryHover"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      );
    }

    // --- [학습 기록 대시보드] ---
    function HistoryPanel({ history, onOpen, onClear }) {
      const stats = useMemo(() => {
        if (!history.length) return null;
        const pct = (h) => (h.total / h.maxTotal) * 100;
        const avg = history.reduce((s, h) => s + pct(h), 0) / history.length;
        const recent = history.slice(0, 5);
        const recentAvg = recent.reduce((s, h) => s + pct(h), 0) / recent.length;
        const byCat = {};
        history.forEach((h) => h.items.forEach((i) => {
          byCat[i.category] = byCat[i.category] || { earned: 0, max: 0, n: 0 };
          byCat[i.category].earned += i.earned;
          byCat[i.category].max += i.max;
          byCat[i.category].n += 1;
        }));
        const cats = Object.entries(byCat)
          .map(([name, v]) => ({ name, rate: Math.round((v.earned / v.max) * 100), n: v.n }))
          .sort((a, b) => a.rate - b.rate);
        return { avg: Math.round(avg), recentAvg: Math.round(recentAvg), cats };
      }, [history]);

      if (!history.length) {
        return (
          <Card className="p-6 md:p-8 w-full max-w-2xl mx-auto text-center text-slate-500">
            아직 응시 기록이 없습니다. 첫 모의고사를 풀면 논점 영역별 약점이 여기에 정리됩니다.
          </Card>
        );
      }

      return (
        <Card className="p-6 md:p-8 w-full max-w-2xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-slate-800">나의 학습 기록</h2>
            <button onClick={onClear} className="text-xs font-bold text-slate-400 hover:text-rose-500">기록 삭제</button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 rounded-2xl p-4"><div className="text-2xl font-black">{history.length}</div><div className="text-xs text-slate-500 font-bold mt-1">응시 횟수</div></div>
            <div className="bg-slate-50 rounded-2xl p-4"><div className="text-2xl font-black">{stats.avg}%</div><div className="text-xs text-slate-500 font-bold mt-1">전체 평균</div></div>
            <div className="bg-slate-50 rounded-2xl p-4"><div className="text-2xl font-black">{stats.recentAvg}%</div><div className="text-xs text-slate-500 font-bold mt-1">최근 5회</div></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-700 mb-3">논점 영역별 득점률 <span className="text-xs text-slate-400 font-medium">(낮은 순)</span></h3>
            <div className="space-y-2">
              {stats.cats.map((c, idx) => (
                <div key={c.name} className="flex items-center gap-3 text-sm">
                  <span className={`w-32 shrink-0 font-bold ${idx === 0 && c.rate < 70 ? 'text-rose-500' : 'text-slate-600'}`}>{c.name}</span>
                  <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${c.rate < 50 ? 'bg-rose-400' : c.rate < 75 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${c.rate}%` }}></div>
                  </div>
                  <span className="w-16 text-right text-slate-500 font-semibold">{c.rate}% ({c.n})</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-700 mb-3">최근 답안</h3>
            <ul className="divide-y divide-slate-100">
              {history.slice(0, 10).map((h) => (
                <li key={h.id}>
                  <button onClick={() => onOpen(h)} className="w-full flex items-center justify-between gap-3 py-3 text-left hover:bg-slate-50 rounded-lg px-2">
                    <span className="min-w-0">
                      <span className="block font-bold text-slate-700 truncate">{h.topic}</span>
                      <span className="text-xs text-slate-400">{formatDate(h.date)}</span>
                    </span>
                    <span className="font-black text-slate-800 whitespace-nowrap">{h.total} / {h.maxTotal}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      );
    }

    // --- [시험지: 문제·지문·배점] ---
    function ExamPaper({ exam }) {
      return (
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-slate-800 text-white px-4 py-1 rounded-md text-sm font-extrabold tracking-widest shadow-sm">문제</span>
            </div>
            <p className="text-slate-800 leading-loose text-base md:text-lg break-keep">{exam.problem}</p>
          </section>

          <section className="bg-white p-6 border border-slate-300 space-y-4 shadow-sm">
            {exam.passageTitle && <div className="text-center font-bold text-slate-600 text-sm">[{exam.passageTitle}]</div>}
            {exam.passage.map((p, idx) => (
              <div key={idx} className="flex gap-3 text-base md:text-lg">
                {p.speaker && <span className="font-extrabold text-slate-800 whitespace-nowrap">{p.speaker}{p.speaker.startsWith('(') ? '' : ':'}</span>}
                <span className="text-slate-700 leading-loose break-keep">{p.text}</span>
              </div>
            ))}
          </section>

          <div className="w-full h-px bg-slate-300"></div>

          <section className="space-y-8">
            <div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base mb-4 bg-slate-100 px-3 py-1.5 inline-block rounded border border-slate-200">답안 작성 시 유의 사항</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-700 font-medium">
                {GUIDELINES.map((g, idx) => <li key={idx} className="leading-relaxed pl-1">{g}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base mb-4 bg-slate-100 px-3 py-1.5 inline-block rounded border border-slate-200">배 점</h3>
              <div className="space-y-5 text-sm md:text-base text-slate-700 font-medium bg-slate-50 p-5 border border-slate-200 rounded-xl">
                <div>
                  <strong className="block mb-2 text-slate-900 border-b border-slate-300 pb-1">• 논술의 내용 [총 {contentTotal(exam)}점]</strong>
                  <ul className="space-y-2">
                    {exam.questions.map((q) => (
                      <li key={q.id} className="flex justify-between items-start gap-4">
                        <span className="leading-relaxed break-keep">- {q.task}</span>
                        <span className="font-bold whitespace-nowrap">[{q.score}점]</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="block mb-2 text-slate-900 border-b border-slate-300 pb-1">• 논술의 체계 [총 5점]</strong>
                  <ul className="space-y-2">
                    {FORMAT_ITEMS.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-start gap-4">
                        <span className="leading-relaxed">- {item.text}</span>
                        <span className="font-bold whitespace-nowrap">[{item.score}점]</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    }

    // --- [결과 보고서] ---
    function ResultView({ entry, onRetry, onHome }) {
      const r = entry.result;
      const [showAnswer, setShowAnswer] = useState(false);
      return (
        <Card className="p-6 md:p-12 mt-8 w-full max-w-4xl mx-auto">
          <div className="text-center pb-10 mb-10 border-b border-slate-100">
            <div className="flex justify-center gap-2 mb-6">
              <span className="inline-block bg-indigo-50 text-primary px-5 py-1.5 rounded-full text-sm font-bold tracking-wide">평가 결과 보고서</span>
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-amber-50 text-amber-700">자동 채점 (참고용)</span>
            </div>
            <div className="flex justify-center items-end gap-2 mb-6">
              <h2 className="text-5xl md:text-7xl font-black text-slate-800">{r.total}</h2>
              <span className="text-2xl md:text-3xl font-bold text-slate-400 mb-1 md:mb-2">/ {entry.maxTotal}</span>
            </div>
            <p className="text-slate-600 text-lg font-medium max-w-2xl mx-auto leading-relaxed break-keep">{r.overall}</p>
          </div>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                <h3 className="text-2xl font-bold text-slate-800">논술의 내용 <span className="text-primary ml-2">{r.contentScore}점</span></h3>
              </div>
              <div className="grid gap-4">
                {r.items.map((it) => {
                  const q = entry.exam.questions.find((x) => x.id === it.id);
                  return (
                    <div key={it.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="font-bold text-slate-800 text-lg">논점 {it.id}. {it.label}</span>
                        <span className="flex items-center gap-2">
                          <Badge tone={verdictTone(it.verdict)}>{it.verdict}</Badge>
                          <span className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-lg font-bold text-sm">{it.earned} / {it.max}</span>
                        </span>
                      </div>
                      {q && <p className="text-sm text-slate-500 break-keep">{q.task}</p>}
                      {it.evidence && (
                        <blockquote className="border-l-4 border-indigo-200 pl-4 text-slate-600 italic break-keep">“{it.evidence}”</blockquote>
                      )}
                      {it.missing && <p className="text-sm text-rose-600 break-keep"><strong>부족한 점</strong> {it.missing}</p>}
                      {it.suggestion && <p className="text-sm text-slate-700 break-keep"><strong>보완 방법</strong> {it.suggestion}</p>}
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                <h3 className="text-2xl font-bold text-slate-800">논술의 체계 <span className="text-emerald-600 ml-2">{r.formatScore}점</span></h3>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-5">
                <div>
                  <strong className="text-slate-800 block mb-2 font-bold text-lg">논리적 체계성 <span className="text-slate-400 text-base">{r.format.structureScore} / 3</span></strong>
                  <p className="text-slate-600 leading-relaxed break-keep">{r.format.structureComment}</p>
                </div>
                <div className="w-full h-px bg-slate-200"></div>
                <div>
                  <strong className="text-slate-800 block mb-2 font-bold text-lg">맞춤법 및 어휘 <span className="text-slate-400 text-base">{r.format.expressionScore} / 2</span></strong>
                  <p className="text-slate-600 leading-relaxed break-keep">{r.format.expressionComment}</p>
                </div>
              </div>
            </section>

            {r.improvements.length > 0 && (
              <section className="bg-amber-50/60 p-6 rounded-2xl">
                <h4 className="font-bold text-amber-800 mb-3">다음 답안에서 고칠 점</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-700 text-sm break-keep">{r.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </section>
            )}

            <section>
              <button onClick={() => setShowAnswer(!showAnswer)} className="font-bold text-slate-600 hover:text-primary">
                {showAnswer ? '▾ 내 답안 접기' : '▸ 내 답안 다시 보기'} <span className="text-slate-400 text-sm">(공백 제외 {noSpaceLength(entry.answer)}자)</span>
              </button>
              {showAnswer && (
                <pre className="mt-4 whitespace-pre-wrap font-sans bg-slate-50 p-6 rounded-2xl text-slate-700 leading-loose">{entry.answer}</pre>
              )}
            </section>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-16">
            <button onClick={onRetry} className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-10 rounded-2xl">같은 문제 다시 쓰기</button>
            <button onClick={onHome} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-10 rounded-2xl">처음으로 돌아가기</button>
          </div>
        </Card>
      );
    }

    function App() {
      const [settings, setSettings] = useState(() => {
        // 예전 버전에서 저장한 API 키 등은 지운다
        const { apiKey, aiExam, ...rest } = store.get(KEYS.settings, { duration: 3600 });
        return rest;
      });
      const [history, setHistory] = useState(() => store.get(KEYS.history, []));
      const [session, setSession] = useState(() => store.get(KEYS.session, null));
      const [status, setStatus] = useState(() => (store.get(KEYS.session, null) ? 'exam' : 'setup'));
      const [topic, setTopic] = useState('');
      const [viewEntry, setViewEntry] = useState(null);
      const [showSettings, setShowSettings] = useState(false);
      const [showOutline, setShowOutline] = useState(false);
      const [toasts, setToasts] = useState([]);
      const [now, setNow] = useState(Date.now());
      const submittingRef = useRef(false);
      const liveRef = useRef(false);

      const toast = (text, tone) => {
        const id = newId();
        setToasts((t) => [...t, { id, text, tone }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
      };

      useEffect(() => { store.set(KEYS.settings, settings); }, [settings]);
      useEffect(() => { store.set(KEYS.history, history); }, [history]);
      useEffect(() => {
        if (!session) {
          store.remove(KEYS.session);
          return;
        }
        const id = setTimeout(() => store.set(KEYS.session, session), 400);
        return () => clearTimeout(id);
      }, [session]);

      // 새로고침으로 복원된 시험 안내
      useEffect(() => {
        if (session) toast('작성하던 답안을 불러왔습니다. 이어서 작성하세요.');
        store.remove('essay_draft');
      }, []);

      // 타이머: 마감 시각 기준으로 계산하여 새로고침에도 유지
      useEffect(() => {
        if (status !== 'exam') return;
        const id = setInterval(() => setNow(Date.now()), 500);
        return () => clearInterval(id);
      }, [status]);

      const remaining = session ? remainingOf(session, now) : null;

      useEffect(() => {
        if (status !== 'exam' || !session || remaining == null || session.paused) return;
        if (remaining > 0) liveRef.current = true;
        const warned = session.warned || [];
        [600, 300].forEach((mark) => {
          if (remaining <= mark && remaining > 0 && !warned.includes(mark)) {
            toast(`시험 종료 ${mark / 60}분 전입니다. 결론을 준비하세요.`, 'warn');
            setSession((s) => ({ ...s, warned: [...(s.warned || []), mark] }));
          }
        });
        // 화면을 보고 있는 동안 시간이 끝났을 때만 자동 제출한다
        if (remaining === 0 && liveRef.current && !submittingRef.current) {
          toast('시험 시간이 종료되어 답안을 자동 제출합니다.', 'warn');
          handleSubmit(true);
        }
      }, [remaining, status]);

      const startExam = (exam) => {
        const duration = settings.duration;
        liveRef.current = false;
        setSession({
          exam,
          answer: '',
          outline: '',
          duration,
          deadline: duration ? Date.now() + duration * 1000 : null,
          paused: false,
          pausedRemaining: null,
          startedAt: Date.now(),
          warned: [],
        });
        setNow(Date.now());
        setShowOutline(false);
        setStatus('exam');
      };

      const handleStartExam = () => {
        const targetTopic = topic.trim() || pick(EDUCATIONAL_KEYWORDS);
        setTopic(targetTopic);
        startExam(generateTemplateExam(targetTopic));
      };

      const saveEntry = (entry) => {
        setHistory((h) => [entry, ...h.filter((x) => x.id !== entry.id)].slice(0, HISTORY_LIMIT));
      };

      const buildEntry = (exam, answer, result, id) => ({
        id: id || newId(),
        date: Date.now(),
        topic: exam.topic,
        exam,
        answer,
        result,
        total: result.total,
        maxTotal: contentTotal(exam) + 5,
        items: result.items.map(({ id, label, category, earned, max }) => ({ id, label, category, earned, max })),
      });

      const handleSubmit = (auto = false) => {
        if (!session || submittingRef.current) return;
        const answer = session.answer;
        if (!auto) {
          if (!answer.trim()) return alert('답안을 작성해주세요.');
          if (!confirm('답안을 제출하고 채점을 진행하시겠습니까?')) return;
        }
        submittingRef.current = true;
        const entry = buildEntry(session.exam, answer, evaluateSimple(answer, session.exam));
        saveEntry(entry);
        setViewEntry(entry);
        setSession(null);
        submittingRef.current = false;
        setStatus('result');
      };

      const handleGoHome = () => {
        if (status === 'exam' && session) {
          if (!confirm('시험을 중단하고 홈으로 돌아가시겠습니까?\n(작성 중인 답안은 삭제됩니다.)')) return;
          setSession(null);
        }
        setViewEntry(null);
        setTopic('');
        setStatus('setup');
      };

      const togglePause = () => {
        setSession((s) => s.paused
          ? { ...s, paused: false, deadline: Date.now() + s.pausedRemaining * 1000, pausedRemaining: null }
          : { ...s, paused: true, pausedRemaining: remainingOf(s, Date.now()) });
        setNow(Date.now());
      };

      const updateSession = (patch) => setSession((s) => ({ ...s, ...patch }));

      const answer = session?.answer || '';
      const charTotal = answer.length;
      const charNoSpace = noSpaceLength(answer);
      const coverage = useMemo(() => {
        if (!session) return [];
        const sentences = splitSentences(answer);
        return session.exam.questions.map((q) => ({ ...q, hit: matchQuestion(q, sentences).length > 0 }));
      }, [answer, session?.exam]);

      const dday = dDay(settings.examDate);

      return (
        <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-between">
          <Toasts toasts={toasts} />
          {showSettings && (
            <SettingsModal
              settings={settings}
              onClose={() => setShowSettings(false)}
              onSave={(s) => { setSettings(s); setShowSettings(false); toast('설정을 저장했습니다.'); }}
            />
          )}
          <div className="w-full max-w-7xl space-y-6 flex-grow">
            <header className="bg-surface py-5 px-4 md:px-8 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-2">
              <div className="w-24 md:w-32">
                {(status === 'exam' || status === 'result') && (
                  <button onClick={handleGoHome} className="flex items-center gap-1.5 text-slate-500 hover:text-primary font-bold text-sm md:text-base px-2 py-1 rounded-lg hover:bg-indigo-50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <span className="hidden sm:inline">홈으로</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 min-w-0">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h1 className="text-lg md:text-3xl font-extrabold text-slate-800 tracking-tight truncate">초등교직논술 모의고사</h1>
              </div>
              <div className="w-24 md:w-32 flex justify-end items-center gap-2">
                {dday && <span className="hidden sm:inline bg-rose-50 text-rose-600 font-black text-sm px-3 py-1 rounded-lg">{dday}</span>}
                {status !== 'exam' && (
                  <button onClick={() => setShowSettings(true)} aria-label="설정" className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-indigo-50">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </button>
                )}
              </div>
            </header>

            {/* 1. 설정 화면 */}
            {status === 'setup' && (
              <div className="space-y-6 mt-8">
                <Card className="p-8 md:p-12 flex flex-col items-center text-center gap-8 w-full max-w-2xl mx-auto">
                  <div className="w-full text-left space-y-3">
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-lg font-bold text-slate-700">어떤 주제로 연습할까요?</label>
                      <button onClick={() => setTopic(pick(EDUCATIONAL_KEYWORDS))} className="flex items-center gap-1.5 text-sm font-bold text-primary bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg">
                        <span>🎲</span> 랜덤 키워드
                      </button>
                    </div>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="예: 학생 주도성, 늘봄학교, 기초학력 등 (비우면 무작위)"
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-primary outline-none text-lg placeholder-slate-400"
                      onKeyDown={(e) => e.key === 'Enter' && handleStartExam()}
                    />
                  </div>
                  <label className="w-full block text-left">
                    <span className="block text-sm font-bold text-slate-600 mb-2">시험 시간</span>
                    <select
                      value={settings.duration}
                      onChange={(e) => setSettings({ ...settings, duration: Number(e.target.value) })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary"
                    >
                      {TIME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </label>
                  <button onClick={handleStartExam} className="w-full md:w-auto bg-primary hover:bg-primaryHover text-white font-bold text-lg md:text-xl py-5 px-16 rounded-2xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1">
                    모의고사 시작하기
                  </button>
                  <button type="button" data-ys-install className="w-full md:w-auto md:ml-3 mt-3 md:mt-0 bg-white border-2 border-indigo-200 text-primary hover:bg-indigo-50 font-bold text-base md:text-lg py-3.5 md:py-5 px-8 rounded-2xl transition-colors">
                    📲 앱으로 설치하기
                  </button>
                </Card>
                <HistoryPanel
                  history={history}
                  onOpen={(h) => { setViewEntry(h); setStatus('result'); }}
                  onClear={() => confirm('모든 응시 기록을 삭제할까요?') && setHistory([])}
                />
              </div>
            )}

            {/* 2. 시험 화면 */}
            {status === 'exam' && session && (
              <div className="flex flex-col lg:flex-row gap-6 mt-6">
                <Card className="w-full lg:w-5/12 p-6 md:p-8 flex flex-col h-[600px] lg:h-[800px]">
                  <div className="flex-grow overflow-y-auto pr-3 custom-scrollbar pb-4">
                    <ExamPaper exam={session.exam} />
                  </div>
                </Card>

                <Card className="w-full lg:w-7/12 p-6 md:p-8 flex flex-col h-[700px] lg:h-[800px]">
                  <div className="flex flex-wrap justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-2xl mb-4 gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl font-black font-mono tracking-wider ${remaining != null && remaining < 600 ? 'text-red-600' : 'text-slate-700'}`}>
                        {remaining == null ? '제한 없음' : formatTime(remaining)}
                      </div>
                      {remaining != null && remaining > 0 && (
                        <button onClick={togglePause} className="text-sm font-bold px-3 py-1.5 rounded-lg bg-white shadow-sm text-slate-600 hover:text-primary">
                          {session.paused ? '▶ 재개' : '❚❚ 일시정지'}
                        </button>
                      )}
                      {remaining === 0 && <span className="text-sm font-bold text-rose-500">시간 종료</span>}
                    </div>
                    <button onClick={() => setShowOutline(!showOutline)} className={`text-sm font-bold px-3 py-1.5 rounded-lg ${showOutline ? 'bg-primary text-white' : 'bg-white shadow-sm text-slate-600 hover:text-primary'}`}>
                      📝 개요 메모
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4" title="답안에 각 논점과 관련된 표현이 들어갔는지 대략 표시합니다">
                    {coverage.map((q) => (
                      <span key={q.id} className={`text-xs font-bold px-2.5 py-1 rounded-md ${q.hit ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                        {q.hit ? '✓' : '○'} {q.id}. {q.label}
                      </span>
                    ))}
                  </div>

                  {showOutline && (
                    <div className="mb-4">
                      <textarea
                        value={session.outline}
                        onChange={(e) => updateSession({ outline: e.target.value })}
                        placeholder="개요를 먼저 짜면 논점 누락을 줄일 수 있습니다."
                        className="w-full h-36 p-4 bg-amber-50/60 border border-amber-100 rounded-xl resize-none outline-none text-sm leading-relaxed custom-scrollbar"
                      />
                      {!session.outline.trim() && (
                        <button onClick={() => updateSession({ outline: outlineTemplate(session.exam) })} className="text-xs font-bold text-amber-700 mt-1">
                          + 배점 항목으로 개요 틀 채우기
                        </button>
                      )}
                    </div>
                  )}

                  <div className="relative flex-grow flex">
                    <textarea
                      value={answer}
                      onChange={(e) => updateSession({ answer: e.target.value })}
                      disabled={session.paused}
                      placeholder={"서론 - 논점별 본론 - 결론 순서로, 현장 교사의 관점에서 구체적으로 작성해주세요.\n(권장 분량: 공백 제외 1,000자 이상)"}
                      className="flex-grow w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:ring-4 focus:ring-indigo-50 focus:border-primary outline-none text-base md:text-lg leading-loose placeholder-slate-400 custom-scrollbar mb-4"
                      spellCheck={false}
                    />
                    {session.paused && (
                      <div className="absolute inset-0 mb-4 rounded-2xl bg-white/80 flex items-center justify-center font-bold text-slate-600">
                        일시정지 중입니다. 재개하면 이어서 작성할 수 있습니다.
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex gap-4 text-sm font-semibold bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 w-full sm:w-auto justify-center">
                      <span className="text-slate-500">포함 <span className="text-slate-800 ml-1">{charTotal}</span></span>
                      <span className="w-px bg-slate-300"></span>
                      <span className="text-slate-500">제외 <span className={`ml-1 ${charNoSpace < 1000 ? 'text-rose-500' : 'text-emerald-600'}`}>{charNoSpace}</span></span>
                      <span className="w-px bg-slate-300"></span>
                      <span className="text-slate-400">자동 저장됨</span>
                    </div>
                    <button onClick={() => handleSubmit(false)} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white font-bold text-lg py-3 px-10 rounded-xl shadow-md">
                      최종 제출하기
                    </button>
                  </div>
                </Card>
              </div>
            )}

            {/* 3. 결과 화면 */}
            {status === 'result' && viewEntry && (
              <ResultView
                entry={viewEntry}
                onRetry={() => startExam(viewEntry.exam)}
                onHome={handleGoHome}
              />
            )}
          </div>

          <footer className="mt-16 mb-4 text-center text-slate-400 text-sm font-medium w-full tracking-wide">
            © 2026 엽쌤. All rights reserved. · <a href="https://gmlduqzhd123-lab.github.io/YScode/" className="underline underline-offset-4 hover:text-slate-600">엽쌤의 다른 앱 보기 →</a><span className="install-btn"> · <button type="button" className="hover:text-slate-600">📲 앱 설치</button></span><span className="qr-btn"> · <button type="button" data-qr="" className="hover:text-slate-600">📱 QR로 접속</button></span>
            <p className="mt-2 text-xs text-slate-400 font-normal leading-relaxed break-keep">
              이 앱의 문항·지문·채점 기준은 엽쌤의 창작물로 저작권이 있습니다. 개인 학습과 수업 목적의 사용은 자유이나, 무단 복제·재배포 및 상업적 이용을 금합니다.
              <br className="hidden sm:inline" /> 실제 임용시험 기출문제가 아니며, 채점 결과는 참고용입니다.
            </p>
          </footer>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App/>);
