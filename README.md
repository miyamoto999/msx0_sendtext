# msx0_sendtext

MSX0 Stackにテキストファイルをネット転送するプログラムです。

WindowsのTeraTermを使ってファイル転送すると(たぶん)速すぎてMSX0がおかしくなるので、テキストファイルの1行送信するごとにエコーバックを待ってから次の行を送るプログラムになってます。

MSX0のアップデートでちくわ帝国さんのmsx0get(https://chikuwa-empire.com/computer/msx0-app-httpget/)が使えなくなったので、バイナリファイルをishでテキストに変換して転送したら、うまいこと行かなかったので作ってみました。
このような経緯なので、最初に"copy con ファイル名"を送って、ファイル転送後、Ctrl-Z、CRLFを送っているのでBASICのソースを送りつける用途では使いにくくなっています。

## 動作確認した環境

- macOS Sonoma 14.6.1
- Node.js v20.16.0
- MSX0 Stack ver.0.11.08
    - MSX-DOS2 Version 2.20

たぶん、Windowsでも動くと思う。

## ビルド方法
Node.jsを入れた環境で

~~~bash
npm install
npm run build
~~~

を実行します。

## 使用方法
- MSX0側のDOS2上でファイルを保存したいディレクトリに移動しておく。
- ターミナルソフトでMSX0に接続している場合は接続を解除する。
- 次のように実行する。FILEPATHには転送したいテキストファイルのPC上のファイルパスを指定する。
~~~bash
npm run start MSX0のIPアドレス 2223 FIELPATH
~~~
- FILEPATHのファイル名部分の名前でファイルがMSX0上で生成される。

