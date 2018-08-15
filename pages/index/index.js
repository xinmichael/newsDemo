// const newsClassName = {
//   'gn': '国内',
//   'gj': '国际',
//   'cj': '财经',
//   'yl': '娱乐',
//   'js': '军事',
//   'ty': '体育',
//   'other': '其他',
// }

const newsClassNameToCode = {
  '国内': 'gn',
  '国际': 'gj',
  '财经': 'cj',
  '娱乐': 'yl',
  '军事': 'js',
  '体育': 'ty',
  '其他': 'other',
}

Page({
  data: {
    // newsType: ["gn","gj","cj","yl","js","ty","other"],
    newsType: ["国内", "国际", "财经", "娱乐", "军事", "体育", "其他"],
    newsClassIschecked: false,
    checkedLineIsShow: false,
    checkedNewsClassName: '',
    hotNewsTitle: '',
    hotNewsSource: '',
    hotNewsDate: '',
    hotNewsFirstImage: '',
    hotNewsId: '',
    otherNewsInfo: []
  },

  onPullDownRefresh() {
    this.getNewsByClass(this.data.checkedNewsClassName, () => {wx.stopPullDownRefresh()})
  },

  onLoad() {
    this.getNewsByClass('国内');
  },

  onTapNewsClass(event) {
    let newsClassName = event.currentTarget.dataset.newsClass;
    this.getNewsByClass(newsClassName);
  },

  getNewsByClass(newsType,callback) {
    this.setData({
      newsClassIschecked: true,
      checkedLineIsShow: true,
      checkedNewsClassName: newsType
    });
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: newsClassNameToCode[newsType]
      },
      success: res => {
        console.log(res);
        let newsInfo = res.data.result;
        this.setHotNews(newsInfo);
        this.setOtherNews(newsInfo);
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  setHotNews(newsInfo) {
    let hotNewsInfo = newsInfo[0];
    let date = hotNewsInfo.date;
    let source = hotNewsInfo.source ? hotNewsInfo.source : "央视网";
    this.setData({
      hotNewsTitle: hotNewsInfo.title,
      hotNewsSource: source,
      hotNewsDate: date.substring(11, 16),
      hotNewsFirstImage: hotNewsInfo.firstImage,
      hotNewsId: hotNewsInfo.id
    });
  },

  setOtherNews(newsInfo) {
    let otherNewsInfo = [];
    for (let i = 1; i < newsInfo.length; i++) {
      let source = newsInfo[i].source ? newsInfo[i].source : "央视网";
      otherNewsInfo.push({
        title: newsInfo[i].title,
        source: source,
        date: newsInfo[i].date.substring(11, 16),
        imagePath: newsInfo[i].firstImage,
        id: newsInfo[i].id
      });
      this.setData({
        otherNewsInfo: otherNewsInfo
      });
    }
  },

  onTapNews(event) {
    let newsId = event.currentTarget.dataset.newsId;
    wx.navigateTo({
      url: '/pages/detail/detail?newsId=' + newsId
    })
  }
})