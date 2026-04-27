//// BASE 制作開始用ファイル ////
//＜base＞

//（enchant.jsを使う準備）
enchant();

//（ページが読み込まれたときに実行される関数）
window.onload = function () {

	//新たなゲーム世界の誕生（コアオブジェクトを作成する）
	core = new Core(800, 500);
	//時は流れだす (fps = 1秒あたりの処理回数(省略時は「30」))
	core.fps = 60;

	// ゲームで使用する外部ファイルを読み込む
	core.preload(
		'./image/chara1.png'
		, './image/icon0.png'
		
	)

	//キーバインドを設定
	core.keybind(32, 'space');//スペースキーを使う準備

	// (ファイルのプリロードが完了したら実行される関数）
	core.onload = function () {

		scene = new Object();//空のシーンを最初にグローバルで作っておくと便利
		//タイトルシーン作成関数
		let createTitleScene = function () {
			scene = new Scene();//新しいシーンを作成
			scene.backgroundColor = "#222222";//背景色を設定

			//ラベルを追加
			scene.label1 = new Label("Hello EnchantJS");
			scene.label1.color = "#ffffff"
			scene.label1.x = 80;
			scene.addChild(scene.label1);

			//クリック回数表示ラベル
			let score = 0;
			scene.scoreLabel = new Label(score.toString());
			scene.scoreLabel.color = "#ffffff"
			scene.addChild(scene.scoreLabel);

			//残り時間表示ラベル
			let time = 500;
			scene.timeLabel = new Label();

			//リンゴを追加
			scene.apple = new Sprite(16, 16);
			scene.apple.image = core.assets['./image/icon0.png'];
			scene.apple.x = 150;
			scene.apple.y = 185;
			scene.apple.frame = 15;
			scene.addChild(scene.apple);

			scene.apple.onenterframe = function () {
				//withinを用いた当たり判定（対象同士の距離で判定）
				if (scene.apple.within(scene.chara, 10)) {
					scene.apple.x = Math.floor(Math.random() * 300);
				}
				if (scene.age % 120 == 0) {

					scene.apple.x = Math.floor(Math.random() * 300);

				}

			}


			//スプライトを追加
			scene.chara = new Sprite(32, 32);
			scene.chara.image = core.assets['./image/chara1.png'];
			scene.chara.x = 150;
			scene.chara.y = 185;
			scene.chara.frame = 4;
			scene.addChild(scene.chara);

			scene.chara.ontouchend = function () {
				++score;
				scene.scoreLabel.text = score;
				console.log(score);
				scene.chara.x = Math.floor(Math.random() * 300);

			}

			scene.chara.onenterframe = function () {
				// scene.chara.rotation++;
				scene.chara.frame = scene.age % 3;

				//矢印キーで移動
				if (core.input.up) {
					scene.chara.y -= 3;
				}

				if (core.input.down) {
					scene.chara.y += 3;
				}

				if (core.input.right) {
					scene.chara.x += 3;
				}

				if (core.input.left) {
					scene.chara.x -= 3;
				}
			}

			// scene.ontouchend = function(){
			// 	core.replaceScene(createMainScene());
			// }

			return scene;//作成したシーンを返す
		}//createTitleScene ここまで

		core.replaceScene(createTitleScene());//coreのreplaceSceneメソッドを用いたシーンの入れ替え

		//メインシーン作成関数
		let createMainScene = function () {
			scene = new Scene();//新しいシーンを作成
			scene.backgroundColor = "#000000";//背景色を設定

			//フレームごとの処理
			scene.onenterframe = function () {//<<<<<< この行は変更しません

			}

			//メインシーンをタッチすると、このシーンに新たなシーンをプッシュするよう設定
			scene.ontouchend = function () {
				core.pushScene(pushNewScene());
			}
			return scene;//作成したシーンを返す
		}//createMainScene ここまで


		//PAUSEシーンのプッシュ
		let pushScene = new Object();
		let pushNewScene = function () {
			pushScene = new Scene();

			pushScene.label = new Label("PAUSED");
			pushScene.label.width = core.width;
			pushScene.label.x = 0;
			pushScene.label.y = 150;
			pushScene.label.textAlign = "center";
			pushScene.label.color = "#ffffff"
			pushScene.addChild(pushScene.label);

			// pushScene.opacity = 0.5

			pushScene.ontouchend = function () {
				core.popScene();
			}

			return pushScene;
		}

	}//core.onload

	// ゲームスタート
	core.start();

}//window.onload
