<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>초등교직논술 AI 모의고사</title>
  
  <!-- React 및 ReactDOM CDN -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  
  <!-- Babel (브라우저에서 React JSX를 실행하기 위함) -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-800 font-sans">
  
  <!-- React 앱이 렌더링될 루트 DOM -->
  <div id="root"></div>

  <!-- 메인 애플리케이션 코드 -->
  <script type="text/babel">
    const { useState, useEffect } = React;

    // --- [AI 프롬프트 설정] ---
    const GENERATE_PROMPT = `당신은 초등 임용고시 교직논술 출제 위원장입니다. 
주어진 주제에 맞춰 3~4명의 교사가 협의하는 대화문과 4개의 하위 논제를 출제하세요.
반드시 아래 JSON 형식으로만 응답해야 하며, 마크다운(\`\`\`json 등)이나 다른 텍스트는 절대 포함하지 마세요.
{
  "title": "모의고사 제목",
  "scenario": ["김 교사: ...", "박 교사: ...", "최 교사: ..."],
  "questions": [
    {"id": 1, "task": "논제 1 내용", "score": 4},
    {"id": 2, "task": "논제 2 내용", "score": 4},
    {"id": 3, "task": "논제 3 내용", "score": 4},
    {"id": 4, "task": "논제 4 내용", "score": 3}
  ],
  "formatScore": 5
}`;

    const GRADE_PROMPT = `당신은 초등교사 임용고시 교직논술 수석 채점 위원장입니다. 
출제 기준과 수험생 답안을 바탕으로 극도로 객관적이고 엄격하게 평가하십시오.
반드시 아래 JSON 형식으로만 응답해야 하며, 마크다운이나 다른 텍스트는 절대 포함하지 마세요.
{
  "totalScore": 0,
  "contentScore": 0,
  "formatScore": 0,
  "contentFeedback": [
    {
      "questionId": 1,
      "task": "하위 논제 1 내용 요약",
      "earnedScore": 0,
      "maxScore": 0,
      "missingKeywords": ["누락 키워드1"],
      "comment": "감점 요인 등 구체적 피드백"
    }
  ],
  "formatFeedback": {
    "structureComment": "논리적 체계성 피드백",
    "grammarComment": "맞춤법 및 어휘 피드백"
  },
  "overallReview": "총평"
}`;

    function App() {
      // --- [상태 관리] ---
      const [apiKey, setApiKey] = useState('');
      const [status, setStatus] = useState('setup');
      const [topic, setTopic] = useState('2022 개정 교육과정과 학생 주도성');
      
      const [examData, setExamData] = useState(null);
      const [answer, setAnswer] = useState('');
      const [resultData, setResultData] = useState(null);
      
      const [timeLeft, setTimeLeft] = useState(3600);
      const [isSaved, setIsSaved] = useState(false);
      const [charCount, setCharCount] = useState({ total: 0, noSpaces: 0 });

      // --- [초기 로드 및 자동 저장] ---
      useEffect(() => {
        const savedKey = localStorage.getItem('LLM_API_KEY');
        const savedDraft = localStorage.getItem('essay_draft');
        if (savedKey) setApiKey(savedKey);
        if (savedDraft && status === 'setup') setAnswer(savedDraft);
      }, [status]);

      useEffect(() => {
        setCharCount({
          total: answer.length,
          noSpaces: answer.replace(/\\s/g, '').length,
        });

        const timeoutId = setTimeout(() => {
          if (answer && status === 'exam') {
            localStorage.setItem('essay_draft', answer);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
          }
        }, 1000);
        return () => clearTimeout(timeoutId);
      }, [answer, status]);

      // 타이머 최적화
      useEffect(() => {
        let timer;
        if (status === 'exam') {
          timer = setInterval(() => {
            setTimeLeft((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
        return () => clearInterval(timer);
      }, [status]);

      // --- [AI API 통신 헬퍼] ---
      const callGeminiAPI = async (systemInstruction, userText) => {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: userText }] }],
            systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
            generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
          })
        });
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(`API 에러: ${errData?.error?.message || 'API 키를 다시 확인해주세요.'}`);
        }
        
        const data = await response.json();
        if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
          throw new Error('AI 응답이 차단되었거나 올바르지 않습니다.');
        }

        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/\`\`\`(json)?/gi, '').trim();
        
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("JSON 파싱 에러 원본 텍스트:", text);
          throw new Error('AI가 규격화된 형식을 반환하지 못했습니다. 다시 시도해주세요.');
        }
      };

      // --- [액션 핸들러] ---
      const handleStartExam = async () => {
        if (!apiKey) return alert('Gemini API 키를 입력해주세요.');
        localStorage.setItem('LLM_API_KEY', apiKey);
        
        setAnswer('');
        localStorage.removeItem('essay_draft');
        setStatus('generating');
        
        try {
          const data = await callGeminiAPI(GENERATE_PROMPT, `주제: ${topic}`);
          setExamData(data);
          setTimeLeft(3600);
          setStatus('exam');
        } catch (error) {
          alert(error.message);
          setStatus('setup');
        }
      };

      const handleSubmit = async () => {
        if (!answer.trim()) return alert('답안을 작성해주세요.');
        if (!confirm('답안을 제출하고 채점을 진행하시겠습니까?')) return;
        
        setStatus('grading');
        
        try {
          const data = await callGeminiAPI(GRADE_PROMPT, `[출제 기준 및 배점]: ${JSON.stringify(examData)}\n[수험생 답안]: ${answer}`);
          setResultData(data);
          setStatus('result');
          localStorage.removeItem('essay_draft');
        } catch (error) {
          alert(error.message);
          setStatus('exam');
        }
      };

      const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
      };

      // --- [UI 렌더링] ---
      return (
        <div className="min-h-screen p-4 flex flex-col items-center">
          <div className="w-full max-w-5xl space-y-6">
            
            {/* 헤더 */}
            <header className="bg-white p-6 rounded-xl shadow border border-gray-200">
              <h1 className="text-2xl font-bold text-blue-700">초등교직논술 AI 모의고사</h1>
              <p className="text-gray-500 mt-1">100% 브라우저 기반 출제 및 자동 채점 시스템</p>
            </header>

            {/* 설정 화면 */}
            {status === 'setup' && (
              <div className="bg-white p-8 rounded-xl shadow border border-gray-200 flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Gemini API 키</label>
                  <input 
                    type="password" 
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AI-..." 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">출제 주제 입력</label>
                  <input 
                    type="text" 
                    value={topic} 
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <button 
                  onClick={handleStartExam}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition"
                >
                  모의고사 출제 시작
                </button>
              </div>
            )}

            {/* 로딩 화면 */}
            {(status === 'generating' || status === 'grading') && (
              <div className="bg-white p-12 rounded-xl shadow text-center">
                <div className="text-xl font-bold animate-pulse text-blue-600">
                  {status === 'generating' ? 'AI가 지문을 생성하고 있습니다...' : '수석 채점 위원장이 답안을 채점 중입니다...'}
                </div>
              </div>
            )}

            {/* 시험 화면 */}
            {status === 'exam' && examData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 지문 영역 */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-200 h-[800px] overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4">{examData.title}</h2>
                  <div className="bg-gray-100 p-4 rounded-lg mb-6 space-y-3">
                    {examData.scenario.map((line, idx) => (
                      <p key={idx} className="leading-relaxed">{line}</p>
                    ))}
                  </div>
                  <h3 className="font-bold text-lg mb-3">작성 조건 및 배점 (총 15점)</h3>
                  <ul className="list-decimal pl-5 space-y-2">
                    {examData.questions.map((q) => (
                      <li key={q.id}>{q.task} [{q.score}점]</li>
                    ))}
                  </ul>
                </div>

                {/* 답안 작성 에디터 */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col h-[800px]">
                  <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-4">
                    <div className={`text-xl font-bold ${timeLeft < 600 ? 'text-red-600' : 'text-blue-600'}`}>
                      남은 시간: {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {isSaved ? '✅ 임시 저장됨' : '작성 중...'}
                    </div>
                  </div>
                  
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="여기에 답안을 작성하세요. (권장: 1,100 ~ 1,200자)"
                    className="flex-1 w-full p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none text-lg leading-relaxed mb-4"
                    spellCheck={false}
                  />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">
                      공백 포함: {charCount.total}자 / 공백 제외: {charCount.noSpaces}자
                    </span>
                    <button 
                      onClick={handleSubmit}
                      className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-6 rounded-lg transition"
                    >
                      답안 제출하기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 채점 결과 대시보드 */}
            {status === 'result' && resultData && (
              <div className="bg-white p-8 rounded-xl shadow border border-gray-200 space-y-8">
                <div className="text-center border-b pb-6">
                  <h2 className="text-3xl font-bold text-gray-800">최종 점수: {resultData.totalScore} / 20점</h2>
                  <p className="text-gray-600 mt-2">{resultData.overallReview}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                    내용 영역 ({resultData.contentScore} / 15점)
                  </h3>
                  <div className="space-y-4">
                    {resultData.contentFeedback.map((fb) => (
                      <div key={fb.questionId} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <div className="flex justify-between font-bold mb-2">
                          <span>{fb.task}</span>
                          <span>{fb.earnedScore} / {fb.maxScore}점</span>
                        </div>
                        {fb.missingKeywords && fb.missingKeywords.length > 0 && (
                          <p className="text-sm text-red-600 mb-1">
                            누락 키워드: {fb.missingKeywords.join(', ')}
                          </p>
                        )}
                        <p className="text-gray-700 text-sm leading-relaxed">{fb.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                    체계 영역 ({resultData.formatScore} / 5점)
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 space-y-3">
                    <p className="text-sm text-gray-700"><strong className="text-gray-900">논리적 체계성:</strong> {resultData.formatFeedback.structureComment}</p>
                    <p className="text-sm text-gray-700"><strong className="text-gray-900">맞춤법 및 어휘:</strong> {resultData.formatFeedback.grammarComment}</p>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button 
                    onClick={() => { setStatus('setup'); setAnswer(''); setExamData(null); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
                  >
                    새로운 모의고사 시작하기
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      );
    }

    // React 애플리케이션 렌더링
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
