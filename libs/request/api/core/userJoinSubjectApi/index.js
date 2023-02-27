const apis = {
  // 入组
  doJoinJson: {
    method: 'POST',
    url: 'userJoinSubjectApi/doJoinJson',
    group: 'core',
    dataType: 'json'
  },
  getJoinSubjectCodeRole: {
    method: 'GET',
    url: 'userJoinSubjectApi/getJoinSubjectCodeRole',
    group: 'core',
    dataType: 'json'
  },
  memberDetail: {
    method: 'GET',
    url: 'userJoinSubjectApi/memberDetail',
    group: 'core',
    dataType: 'json'
  },
  doctorIndex: {
    method: 'GET',
    url: 'userJoinSubjectApi/doctorIndex',
    group: 'core',
    dataType: 'json'
  },
  doctorViewMemberDetailById: {
    method: 'GET',
    url: 'userJoinSubjectApi/doctorViewMemberDetailById',
    group: 'core',
    dataType: 'json'
  },
  phaseStatusEndTreatment: {
    method: 'GET',
    url: 'userJoinSubjectApi/phaseStatusEndTreatment',
    group: 'core',
    dataType: 'form'
  },
  doctorSubjectManagement: {
    method: 'GET',
    url: 'userJoinSubjectApi/doctorSubjectManagement',
    group: 'core',
    dataType: 'form'
  },
  doctorAgreeUserJoin: {
    method: 'POST',
    url: 'userJoinSubjectApi/doctorAgreeUserJoin',
    group: 'core',
    dataType: 'json'
  },
  doctorBackFirstQuestionnaire: {
    method: 'POST',
    url: 'userJoinSubjectApi/doctorBackFirstQuestionnaire',
    group: 'core',
    dataType: 'json'
  },
  doctorRemindUserFillOutQuestionnaire: {
    method: 'GET',
    url: 'userJoinSubjectApi/doctorRemindUserFillOutQuestionnaire',
    group: 'core',
    dataType: 'form'
  },

}

export default apis
