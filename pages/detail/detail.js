// pages/detail/detail.js
Page({
  data: {
    newsId: '',
    title: '',
    source: '',
    date: '',
    readCount: ''
  },

  onPullDownRefresh() {
    this.getNewsDetail(() => {
      wx.stopPullDownRefresh()
    })
  },

  onLoad(options) {
    this.setData({
      newsId: options.newsId,
      newsContentDetail: []
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    this.getNewsDetail();
  },

  onTapBackToIndex() {
    wx.navigateBack({
      delta: 1
    })
  },

  getNewsDetail(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: this.data.newsId
      },
      success: res => {
        let newsDetail = res.data.result;
        this.setNewsDetailHead(newsDetail);
        this.setNewsDetailContent(newsDetail);
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  setNewsDetailHead(newsDetail){
    let source = newsDetail.source ? newsDetail.source : "央视网";
    this.setData({
      title: newsDetail.title,
      source: source,
      date: newsDetail.date.substring(11, 16),
      readCount: newsDetail.readCount
    });
    console.log(newsDetail);
  },

  setNewsDetailContent(newsDetail){
    let newsContent = newsDetail.content;
    let newsContentDetail = [];
    for (let i = 0; i < newsContent.length; i++){
      if (newsContent[i].text){
        newsContentDetail.push({
          type: newsContent[i].type,
          text: newsContent[i].text
        });
      }else{
        newsContentDetail.push({
          type: newsContent[i].type,
          src: newsContent[i].src
        });
      }
    }
    this.setData({
      newsContentDetail: newsContentDetail
    });
  }
})