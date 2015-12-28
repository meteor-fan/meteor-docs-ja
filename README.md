This is a community project to translate Meteor docs into Japanese.
This project is not affiliated with MDG.

----

## Meteor公式ドキュメント日本語化

### 手順（方法１：JSONを変更していく方法）

1. リポジトリを更新する。
2. translationsの中にファイルを作成する。ファイル名は"タグ-日付-作者.json"。基本的には`<p>`タグの単位で。
3. 翻訳が完了していない段落をコピペして、jsonファイルに貼り付ける。keyが原文でvalueが訳文のオブジェクトにする。
4. `npm start`を実行して、トップディレクトリに生成されたhtmlをブラウザで確認する。
5. 問題なければ、commitしてpushする。

### 手順（方法２：HTMLを変更していく方法。オススメ。）
1. リポジトリを更新する
2. work/以下のhtmlファイルを開く（このファイルを編集していく）
3. 翻訳する最小の単位のタグを、直下にコピーし、classに"translation"を追加し、翻訳する。
```
<p>..english..</p>
↓
<p>..english..</p>
<p class="translation">..日本語..</p>

注意：<ul><li><p>..</p></li></ul>の構造のとき、一番内側の<p>だけをコピーして翻訳する。
```
4. `npm run generate`を実行する。この操作で、work/以下のhtmlから.translationのついたタグと、そのひとつ前のタグでmapを作り、translations/*.jsonを生成する。
5. `npm run translate`を事項する。この操作で、translations/*.jsonから、表示用のhtmlを作成する。
6. ローカルでサーバーを起動して確認するために、`npm start`を実行する（オプション）
7. 問題なければ、commitしてpushする。commitは、

### コミュニケーション

役割分担や進捗報告などは、
[Slack](https://meteor-fan.herokuapp.com/)の#docs-jaチャンネル
で行いますので、協力していただける方はご参加ください。
