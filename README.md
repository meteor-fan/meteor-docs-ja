This is a community project to translate Meteor docs into Japanese.
This project is not affiliated with MDG.

----

## Meteor公式ドキュメント日本語化

### 手順

1. リポジトリを更新する。
2. translationsの中にファイルを作成する。ファイル名は"タグ-日付-作者.json"。基本的には`<p>`タグの単位で。
3. 翻訳が完了していない段落をコピペして、jsonファイルに貼り付ける。keyが原文でvalueが訳文のオブジェクトにする。
4. `npm start`を実行して、トップディレクトリに生成されたhtmlをブラウザで確認する。
5. 問題なければ、commitしてpushする。


### コミュニケーション

役割分担や進捗報告などは、
[Slack](https://meteor-fan.herokuapp.com/)の#docs-jaチャンネル
で行いますので、協力していただける方はご参加ください。
