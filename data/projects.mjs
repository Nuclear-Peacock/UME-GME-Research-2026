/* TOPIC DATA
   - accentKey: which PATHWAYS entry supplies this card's color/icon accent
   - tags:      every filter chip this topic should appear under (a topic
                can belong to more than one) */
export const SEED_PROJECTS = [
  {
    id:1, accentKey:'ai-med-ed', icon:'network', tags:['ai-med-ed','data-ready'],
    title:'Bridging Clinical Gaps with Agentic AI',
    hook:'A scalable, simulation-based framework for radiology education — data collected, article slot reserved.',
    badges:['Ready to Write'],
    status:'Immediately actionable — selected for a special issue', urgent:true,
    why:'Uses agentic AI to help close clinical education gaps through scalable, simulation-based radiology education.',
    role:'Literature support, manuscript drafting, figure and table development, refining the educational framework, and building practical examples.',
    output:'Academic Radiology, special issue.',
    timeline:'High urgency — due July 20.',
    skills:['AI in education','Simulation design','Radiology education scholarship','Academic writing']
  },
  {
    id:2, accentKey:'ai-med-ed', icon:'notebook', tags:['ai-med-ed','data-ready'],
    title:'Grounded AI Platforms to Enhance Research and Education',
    hook:'A practical look at NotebookLM-style grounded AI tools, with a reserved journal slot.',
    badges:['Ready to Write'],
    status:'Immediately actionable — selected for a special issue', urgent:true,
    why:'A practical article highlighting grounded AI tools like NotebookLM for research and education use.',
    role:'Develop worked examples, test use cases, summarize educational applications, and help build tables or workflow figures.',
    output:'Current Problems in Diagnostic Radiology, special issue.',
    timeline:'High urgency — due July 20.',
    skills:['Grounded AI','Evidence-supported prompting','Research workflows','Educational tool design']
  },
  {
    id:3, accentKey:'ai-med-ed', icon:'workshop', tags:['ai-med-ed','data-ready'],
    title:'Rapid Upskilling for Future Physicians',
    hook:'A hands-on workshop boosts first-year students\u2019 AI competence and confidence — the manuscript is already well underway.',
    badges:['Ready to Write'],
    status:'Manuscript partially drafted — light writing and revision needed',
    why:'Shows how early medical students can gain real confidence and competence with AI through hands-on training. A good chunk of the manuscript is already drafted, so this is a light lift: mostly finishing touches and revision rather than starting from scratch.',
    role:'Review relevant literature, help finish and revise the partially drafted manuscript sections, refine figures and tables, and connect results to the medical education literature.',
    output:'Medical Science Educator or a similar journal.',
    timeline:'',
    skills:['Literature review','Survey-based education research','Manuscript revision','AI literacy']
  },
  {
    id:4, accentKey:'ai-med-ed', icon:'shield', tags:['ai-med-ed','data-ready'],
    title:'Calibrating Human-AI Interactions Through Education and Training',
    hook:'USU\u2019s readiness-focused AI education model, headed to a NATO symposium on AI-enhanced medical readiness.',
    badges:['Ready to Write'],
    status:'Abstract selected — NATO Human Factors & Medicine Symposium', urgent:true,
    why:'A multidisciplinary synthesis of AI education activities across UME, GME, CME, and Allied Health at USUHS.',
    role:'Help map educational activities, organize themes, support the literature review, contribute figures and tables, and assist with manuscript structure.',
    output:'NATO Scientific Organization paper; BMJ abstract publication.',
    timeline:'Moderate/high urgency — full paper due September 14.',
    skills:['Medical readiness scholarship','AI education strategy','Institutional meta-analysis','Academic synthesis']
  },
  {
    id:5, accentKey:'ai-med-ed', icon:'survey', tags:['ai-med-ed','data-ready'],
    title:'AI in Medical Research Education: Student Experiences with the WebApp',
    hook:'Turning student experience with an AI-enabled research education WebApp into a write-up.',
    badges:['Ready to Write'],
    status:'Data ready — needs write-up',
    why:'Captures medical student experiences with an AI-enabled research education WebApp.',
    role:'Review relevant literature, analyze student reflections or survey data, write the results and discussion sections, and help develop practical implications.',
    output:'A medical education or clinical education journal.',
    timeline:'',
    skills:['Literature review','Education research','Qualitative & quantitative analysis','AI-enabled learning design']
  },
  {
    id:6, accentKey:'ongoing-data', icon:'faculty', tags:['ai-med-ed','ongoing-data','data-ready'],
    title:'Faculty Development AI Education Program',
    hook:'Helping USUHS faculty use AI effectively and ethically so they can teach it responsibly.',
    badges:['Ready to Write'],
    status:'Ongoing data collection — ready to write up', ongoing:true,
    why:'Helps faculty learn effective, ethical uses of AI so they can teach trainees responsibly.',
    role:'Support the curriculum write-up, summarize survey responses, develop implementation tables, and help prepare MedEdPortal-style materials.',
    output:'MedEdPortal curriculum submission, plus a possible manuscript for Academic Medicine, The Clinical Teacher, or similar.',
    timeline:'',
    skills:['Faculty development','Curriculum scholarship','Ethical AI education','Dissemination writing']
  },
  {
    id:13, accentKey:'ongoing-data', icon:'network', tags:['ai-med-ed','ongoing-data','data-ready'],
    title:'Fundamentals of AI in Radiology Course: Curriculum and Outcomes',
    hook:'A hybrid AI-in-imaging curriculum from the Walter Reed National Military Medical Center Radiology Residency Program, headed for a curriculum manuscript.',
    badges:['Ready to Write'],
    status:'Ongoing data collection — proposal due Sept 1, 2026', ongoing:true, urgent:true,
    why:'The Fundamentals of AI in Radiology Course was developed in the Walter Reed National Military Medical Center Radiology Residency Program as a hybrid program spanning UME, GME, CME, and Allied Health, building knowledge and skills in AI in imaging. A manuscript on the curriculum and its outcomes is planned for a special Academic Radiology issue on Education in Diverse Environments.',
    role:'Help describe the curriculum and hybrid learner tracks, compile and summarize outcomes data, prepare tables and figures, and support the literature review on AI in radiology education.',
    output:'Academic Radiology, focus issue on Education in Diverse Environments.',
    timeline:'Proposal due September 1, 2026; manuscript submission due January 18, 2027.',
    skills:['Curriculum development scholarship','Hybrid medical education design','AI in radiology education','Academic writing']
  },
  {
    id:14, accentKey:'ongoing-data', icon:'radiation', tags:['afrri','ongoing-data','data-ready'],
    title:'AFRRI Virtual MEIR Course: Curriculum and Outcomes',
    hook:'Describing the curriculum and outcomes of AFRRI\u2019s virtual Medical Effects of Ionizing Radiation course for a wide range of learners.',
    badges:['Ready to Write'],
    status:'Ongoing data collection — proposal due Sept 1, 2026', ongoing:true, urgent:true,
    why:'A description of the curriculum and outcomes for the AFRRI virtual Medical Effects of Ionizing Radiation (MEIR) course, delivered in a hybrid format to a wide variety of learners. If the proposal is accepted, the paper will be submitted for the same Academic Radiology focus issue on Education in Diverse Environments.',
    role:'Help describe the course structure across learner types, summarize outcomes data, support the literature review on radiation education, and prepare tables and figures.',
    output:'Academic Radiology, focus issue on Education in Diverse Environments.',
    timeline:'Proposal due September 1, 2026; manuscript submission due January 18, 2027 (if accepted).',
    skills:['Radiation medicine education','Curriculum evaluation','Hybrid learning design','Academic writing']
  },
  {
    id:15, accentKey:'ongoing-data', icon:'survey', tags:['afrri','ongoing-data','data-ready'],
    title:'Validating New Survey Instruments for Radiation Education Efficacy',
    hook:'A novel set of survey instruments for gauging radiation education efficacy in the AFRRI Virtual MEIR course, with validation data already in hand.',
    badges:['Ready to Write'],
    status:'Ongoing data collection — ready to submit', ongoing:true,
    why:'A novel set of survey instruments was developed to gauge the efficacy of radiation education in the AFRRI Virtual MEIR course. Data collection is ongoing, and validation data are already available.',
    role:'Help analyze the validation data, draft the methods and results sections describing instrument development, and support the literature review on radiation education assessment tools.',
    output:'A medical education or health physics / radiation education journal.',
    timeline:'',
    skills:['Instrument development and validation','Survey research methodology','Basic psychometrics','Academic writing']
  },
  {
    id:7, accentKey:'nm-cases', icon:'casefile', tags:['nm-cases','case-reports','data-ready'],
    title:'Military Nuclear Medicine Case Series',
    hook:'"Boots on the Ground, Eyes on the Scan" — a case series of military-relevant nuclear medicine cases.',
    badges:['Case Report','Ready to Write'],
    status:'Cases obtained — write-up needed',
    why:'Highlights nuclear medicine cases relevant to military medicine, deployment, readiness, and operational contexts.',
    role:'Draft cases, review background literature, prepare image figures, and develop teaching points.',
    output:'Journal of Nuclear Medicine Technology or the R3 Journal.',
    timeline:'',
    skills:['Case-based scholarship','Nuclear medicine imaging','Military medical relevance','Clinical writing']
  },
  {
    id:8, accentKey:'nm-cases', icon:'scanner', tags:['nm-cases','data-ready'],
    title:'DOTATATE PET/CT Pancreatic False Positives',
    hook:'Looking beyond the pancreatic head for false-positive uptake that can mimic malignancy.',
    badges:['Retrospective Analysis','Ready to Write'],
    status:'Data available — needs manuscript writing',
    why:'DOTATATE PET/CT has known false-positive uptake in the pancreatic head from SSTR expression, but uptake in the body or tail can also be mistaken for malignancy. This is a retrospective analysis of clinical data already collected, characterizing those uptake patterns to help tell false positives from true lesions.',
    role:'Literature review, organizing results, preparing figures, and drafting the introduction and discussion.',
    output:'A nuclear medicine or radiology journal.',
    timeline:'',
    skills:['PET/CT interpretation','NET imaging','Diagnostic pitfalls','Retrospective imaging research']
  },
  {
    id:9, accentKey:'nm-cases', icon:'calm', tags:['nm-cases','case-reports','data-ready'],
    title:'PET/CT with Patient Hypnosis for Severe Claustrophobia',
    hook:'A creative, patient-centered path to completing PET/CT imaging for a highly claustrophobic patient.',
    badges:['Case Report','Ready to Write'],
    status:'Case write-up needed',
    why:'Demonstrates a creative, patient-centered approach to completing PET/CT imaging in a highly claustrophobic patient.',
    role:'Draft the case report, review literature on claustrophobia, hypnosis, and imaging tolerance, prepare figures, and develop teaching points.',
    output:'Journal of Nuclear Medicine Technology.',
    timeline:'',
    skills:['Case writing','Patient-centered imaging','Nuclear medicine workflow','Clinical communication']
  },
  {
    id:10, accentKey:'nm-cases', icon:'casefile', tags:['nm-cases','case-reports','data-ready'],
    title:'Additional Nuclear Medicine Cases',
    hook:'A manageable entry point into academic writing through case-based nuclear medicine scholarship.',
    badges:['Case Report','Ready to Write'],
    status:'Cases available — write-up needed',
    why:'Offers students a manageable entry point into academic writing through case-based nuclear medicine scholarship.',
    role:'Select a case, draft the clinical background, build teaching points, and prepare references and figures.',
    output:'Journal of Nuclear Medicine Technology or the R3 Journal.',
    timeline:'',
    skills:['Case reports','Literature search','Image-based teaching','Concise clinical writing']
  },
  {
    id:11, accentKey:'future', icon:'hub', tags:['future'],
    title:'Expanding Pluvicto Access via a Hub-and-Spoke Model',
    hook:'An 18-month pilot testing whether radiopharmaceutical therapy access can safely reach more of Arizona.',
    badges:[],
    status:'Future activity — implementation / pilot research',
    why:'Patients eligible for Pluvicto in Arizona often face repeated travel to a limited number of specialty centers for a six-cycle course. That burden falls hardest on veterans, rural patients, underinsured patients, minoritized populations, and patients with limited English proficiency. SMIL, Honor Health, and the ASU John Shufeldt School of Medicine and Medical Engineering propose testing a carefully governed hub-and-spoke model to safely extend access. Aim 1 covers legal, operational, and stakeholder feasibility and site selection; Aim 2 builds a literacy-checked, language-appropriate patient and caregiver education toolkit; Aim 3 runs a phased pilot, moving from on-site administrations to tele-supervised administrations only once competency and governance milestones are met. A subsequent Phase 3 will evaluate program effectiveness — tracking access, treatment adherence, and patient-reported outcomes across the hub-and-spoke model — once the pilot demonstrates feasibility.',
    role:'Support phase-2 activities, help make the opportunity visible to eligible populations, assist with patient access analysis, summarize current care pathways and how remote therapy delivery could improve them, and help evaluate program effectiveness once Phase 3 outcomes data are available.',
    output:'Groundwork for Honor Health and Foundation funding, VA implementation funding, NIH dissemination-and-implementation applications, and future Department of War or CDMRP submissions.',
    timeline:'18-month pilot, phased by aim, followed by a Phase 3 effectiveness evaluation.',
    skills:['Health equity research','Implementation science','Radiopharmaceutical therapy systems','Patient education','Stakeholder analysis','Program effectiveness evaluation']
  },
  {
    id:12, accentKey:'future', icon:'pet', tags:['future'],
    title:'NucsAI: Predicting Pluvicto Therapy Response from PSMA PET/CT',
    hook:'An AI model reads PSMA PET/CT scans to help predict who is likely to respond well to Pluvicto.',
    badges:[],
    status:'Future randomized controlled trial',
    why:'An AI model analyzes PSMA PET/CT in prostate cancer — measuring lesions and intensity — to help predict the likelihood that Pluvicto therapy will succeed.',
    role:'Help with trial support, background research, data abstraction, outcome tracking, and manuscript preparation once trial data mature.',
    output:'An institutional RCT evaluating impact on treatment decisions for Pluvicto initiation and patient outcomes.',
    timeline:'',
    skills:['AI imaging analysis','PSMA PET/CT','Theranostics','Clinical trial design','Outcomes research']
  }
];
