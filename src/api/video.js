import request from '@/utils/request'

export const videoApi = {
    // 获取视频列表
    getVideoList(params) {
        return request({
            url: '/videos',
            method: 'get',
            params
        })
    },

    // 获取视频详情
    getVideoDetail(id) {
        return request({
            url: `/videos/${id}`,
            method: 'get'
        })
    },

    // 上传视频
    uploadVideo(data) {
        return request({
            url: '/videos/upload',
            method: 'post',
            data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    // 点赞视频
    likeVideo(id) {
        return request({
            url: `/videos/${id}/like`,
            method: 'post'
        })
    },

    // 收藏视频
    favoriteVideo(id) {
        return request({
            url: `/videos/${id}/favorite`,
            method: 'post'
        })
    }
}