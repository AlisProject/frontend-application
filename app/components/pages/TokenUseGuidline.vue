<template>
  <div class="article-container">
    <app-header showDefaultHeaderNav showOnlySessionLinks class="logo-original"/>
    <div class="area-article">
      <h1 class="area-title">{{ title }}</h1>
      <div class="area-content" v-html="$md.render(body)" />
    </div>
    <app-footer/>
  </div>
</template>

<script>
/* eslint-disable */
import AppHeader from '../organisms/AppHeader'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    AppFooter
  },
  computed: {
    title() {
      return 'ALISトークン利用ガイドライン'
    },
    body() {
      return `
本ガイドラインは「ALIS利用規約」、その他これに基づく各種ガイドライン等（以下「本利用規約等」といいます）と共に適用され、本利用規約等の一部を構成します。ALISトークンの取得または使用をされることによって、本ガイドラインの内容を承諾したものとみなします。ALISトークンの取得または使用をされる前に必ず内容についてご確認くださいますよう、お願いいたします。なお、本ガイドラインに定めのない事項は、全てALIS利用規約によるものとします。

1. 用語の定義
本ガイドラインにおいて使用する用語の定義は、以下のとおりとします。なお、本ガイドラインで定義されていない用語については、「ALIS利用規約」で定める用語の定義に従うものとします。
①    「本ガイドライン」：ALISトークン利用ガイドラインをいいます。
②    「ALISトークン」：本サービスにおいて当社の発行する仮想通貨をいいます。なお、当社は会員に対して当社の定めに従いALISトークンを付与します。
③   「ウォレット」：本サービスにおいて、取得または使用したALISトークンを管理する管理ツールであり、ALISトークンの残高、履歴等を、会員が確認できる管理画面をいいます。
	※ウォレットは開発中のため、現在はご利用いただくことができません。ウォレットに関するサービスの開始時期が決定しましたら、当社のウェブサイトにて告知いたします。

2. サービスの概要
(1)   ALISトークンは、本サービスにおいて会員が取得または使用することのできる仮想通貨です。
(2)   ALISトークンは、本サービスを通じて会員に提供されるサービスのうち、当社が定めたサービスにおいて、当社が定める条件にて使用することができます。なお、当社による付与等、会員によるALISトークンの取得方法に応じて、ALISトークンを使用することができるサービス・利用条件が異なる場合があります。
(3)	ALISトークンは資金決済に関する法律に定める仮想通貨であり、本サービスの外部においても、対価の弁済のために不特定の者に対して使用することができ、また、不特定の者を相手方として購入および売却を行うことができます。当社はALISトークンの使用される範囲や用途を制限するものではありませんが、ALISトークンのご利用にあたっては、法令および社会規範を遵守していただくようお願いいたします。

3. ALISトークンの付与
当社は、以下の場合に、当社の定める方法により、ALISトークンを付与することができます。
①   本サービスにおいてコンテンツの投稿を行い、当該投稿が当社の定めるALISトークン付与条件に合致した場合
②   本サービスにおいて他の会員が投稿したコンテンツに対して「いいね」による評価を行い、当該評価が当社の定めるALISトークン付与条件に合致した場合
③   その他、当社が別途定める場合

4. 退会によるウォレット内のALISトークンの消滅
会員が退会した場合、会員がウォレットにおいて保有する全てのALISトークンは消滅するものとし、返金することはできません。退会する場合は必ずウォレットから本サービス外のERC20に準拠したウォレットにALISトークンを送付したうえで退会を行うようにしてください。

5. ALISトークンの管理・照会
(1)   会員は､ウォレットにおいて､本サービスでのALISトークンを管理するものとし、会員が取得し､または使用したALISトークン数､残高を照会できるものとします｡
(2)   会員は、自己の責任と費用負担によって、ALISトークンの管理を行うものとします。会員の管理不十分によるALISトークンの流出、使用上の過誤（ALISトークンの送信先の過誤を含みます）、第三者の使用、不正アクセス等による損害の責任は会員が負うものとし、当社は一切の責任を負わないものとします。
(3)   会員は､ALISトークン数、残高を取得または使用した場合､ウォレットより､その取得または使用の履歴詳細を確認し､万一誤りがある場合には､ただちに当社に申し出るものとします｡なお､会員がALISトークンを取得または使用した後､1ヶ月以内に申し出がなされない場合､会員は､自らが取得または使用したALISトークン数および残高について誤りがないことを了承したものとみなします｡
(4)   当社は､前項に定める会員の申し出を受け､その申し出に関する調査を行い､会員のALISトークン数、残高に誤りがあると認められた場合､当社の管理するALISトークンに係る電子情報の記録から､正確なALISトークン数を算出し､会員に通知の上､これを訂正するものとします｡
(5)   当社は、会員のALISトークンが、プログラムの不具合等により、ウォレット上に正しく表示されなかった場合は、当社の権限により調整し、正確なALISトークン表示に変更することができるものとします。
(6)   当社は、会員が、当社の定めるルール・条件に従わずに、ALISトークンを不正、虚偽に取得したと判断した場合、該当するALISトークンを取り消すことができるものとします。

6. ALISトークンの出金および送金
会員は本サービスにおけるウォレットからＡＬＩＳトークンを出金または送金する場合は当社の定めに従いそれを行うものとします。なお、当社の定める金額以上のＡＬＩＳトークンをウォレットから送金する場合、当社の承認を得るものとします。また、ＡＬＩＳトークンの出金、送金および送受信において手数料がかかることがあります。

7. 税金および費用
会員のALISトークンの取得または使用にともない､税金や付帯費用が発生する場合には､会員がこれらを負担するものとします｡

8. 免責
(1)   当社は､コンピュータシステムの障害またはメンテナンス等により､会員がALISトークンの取得または使用できなかったことによって発生あるいは誘発された損害について､一切の責任を負わないものとします｡
(2)   当社は､理由の如何を問わず､ID･パスワード、またはALISトークン使用時における外部サービスの認証情報について盗用その他の事故があっても､そのために生ずるALISトークンおよび同ALISトークンに付随する価値の消失､その他一切の損害については､責任を負わないものとします。
(3)	前各項の規定にかかわらず、個人である利用者の損害が当社または当社の役職員の過失によって生じたときは、当社の賠償責任は、損害発生時に当該利用者のウォレット内に存在したALISトークンの時価相当額を上限とします。また、当社または当社の役職員の故意または重過失によって生じたときは、前各項の規定は適用されないものとします。

9. 本ガイドラインの改定について
(1)   当社は、随時本ガイドラインを改定することができるものとします。
(2)   当社は、本ガイドラインを改定しようとする場合、電子メールまたはALIS等を使い随時、会員に告知したうえで、当社の定めに従って本規約の改定を行うものとします。
(3)   前項に基づき、本ガイドラインの改定を告知した日から当社が定める期間を経過した後も会員が退会しない場合、当該会員は本ガイドラインの改定に同意したものとみなされ、当該会員と当社との間で改定後のガイドラインの効力が発生するものとします。
(4)   会員は、前項に定める効力発生の時点以降、当該内容の不知または不承諾を申し立てることはできないものとします。

　　　2018年 4月 17日 制定
`
    }
  }
}
</script>

<style lang="scss" scoped>
.article-container {
  display: grid;
  grid-template-rows: 100px 50px 1fr 75px;
  grid-template-columns: 1fr 640px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    'app-header       app-header       app-header      '
    '...              ...              ...             '
    '...              article          ...             '
    'app-footer       app-footer       app-footer      ';
  background: white;
}

.area-article {
  display: grid;
  grid-area: article;
  grid-template-rows: auto;
  grid-template-columns: auto;
  grid-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    'title  '
    'content';
}

.area-title {
  font-size: 25px;
  grid-area: title;
  letter-spacing: 0.05em;
}

.area-content {
  grid-area: content;
  width: 640px;

  ol {
    width: 640px;
  }
}

@media screen and (max-width: 1080px) {
  .article-container {
    grid-template-rows: 100px 50px 1fr 75px;
  }
}

@media screen and (max-width: 640px) {
  .article-container {
    grid-template-rows: 70px 0 1fr min-content;
    grid-template-columns: 10px 1fr 10px;
    /* prettier-ignore */
    grid-template-areas:
    'app-header       app-header       app-header      '
    '...              ...              ...             '
    'article          article          article         '
    'app-footer       app-footer       app-footer      ';
  }

  .area-article {
    grid-template-columns: 8px auto 8px;
    grid-gap: 10px;
    /* prettier-ignore */
    grid-template-areas:
      '...            title             ...           '
      '...            content           ...           ';
  }

  .area-content {
    width: 90vw;
  }

  .area-title {
    font-size: 16px;
    grid-area: title;
    letter-spacing: 0.1em;
  }
}
</style>
