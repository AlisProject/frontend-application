export default {
  $get(url, params) {
    switch (url) {
      case '/users/potato4d/info': {
        return {
          user_display_name: 'potato4d',
          user_id: 'potato4d',
          self_introduction: 'Frontend technical adviser of ALISMedia.',
          icon_image_url: 'https://alis.to/d/api/info_icon/potato4d/icon/a2981d2a-67ec-4780-86bb-615e97572822.png'
        }
      }
      case '/articles/1/like': {
        return {
          likes_count: 10
        }
      }
    }
  }
}
