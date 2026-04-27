enchant();

window.onload = function () {

    const core = new Core(320, 400);
    core.fps = 60;

    // 🔥 LOAD YOUR ASSETS HERE
    core.preload(
        './image/chara1.png',   // bear
        './image/icon0.png',    // apple
        './image/monster1.png'  // enemy (change if needed)
    );

    // 🎮 controls
    core.keybind(37, 'left');
    core.keybind(38, 'up');
    core.keybind(39, 'right');
    core.keybind(40, 'down');

    core.onload = function () {

        // =========================
        // 🎮 MAIN GAME
        // =========================
        function createGameScene() {

            const scene = new Scene();
            scene.backgroundColor = "#222";

            // ===== Score =====
            let score = 0;
            const scoreLabel = new Label("Score: 0");
            scoreLabel.color = "#fff";
            scoreLabel.y = 10;
            scene.addChild(scoreLabel);

            // ===== Time =====
            let time = 30;
            const timeLabel = new Label("Time: 30");
            timeLabel.color = "#fff";
            timeLabel.x = 220;
            timeLabel.y = 10;
            scene.addChild(timeLabel);

            // ===== Player (Bear) =====
            const player = new Sprite(32, 32);
            player.image = core.assets['./image/chara1.png'];
            player.x = 140;
            player.y = 180;
            scene.addChild(player);

            // ===== Apple =====
            const apple = new Sprite(16, 16);
            apple.image = core.assets['./image/icon0.png'];
            apple.frame = 15;

            function resetApple() {
                apple.x = Math.random() * (core.width - 16);
                apple.y = Math.random() * (core.height - 16);
            }

            resetApple();
            scene.addChild(apple);

            // ===== Enemy =====
            const enemy = new Sprite(32, 32);
            enemy.image = core.assets['./image/monster1.png'];
            enemy.x = 50;
            enemy.y = 50;
            scene.addChild(enemy);

            // ===== Game Loop =====
            scene.onenterframe = function () {

                // 🎮 movement
                if (core.input.up)    player.y -= 3;
                if (core.input.down)  player.y += 3;
                if (core.input.left)  player.x -= 3;
                if (core.input.right) player.x += 3;

                // 🎞 animation (bear)
                player.frame = (scene.age % 3) + 10;

                // 🍎 collect apple
                if (player.within(apple, 20)) {
                    score++;
                    scoreLabel.text = "Score: " + score;
                    resetApple();
                }

                // 👾 enemy movement (random walk)
                enemy.x += Math.random() * 6 - 3;
                enemy.y += Math.random() * 6 - 3;

                // 💥 hit enemy = game over
                if (player.intersect(enemy)) {
                    core.replaceScene(createGameOverScene(score));
                }

                // ⏳ timer
                if (core.frame % core.fps === 0 && time > 0) {
                    time--;
                    timeLabel.text = "Time: " + time;
                }

                if (time === 0) {
                    core.replaceScene(createGameOverScene(score));
                }
            };

            return scene;
        }

        // =========================
        // 💀 GAME OVER
        // =========================
        function createGameOverScene(score) {

            const scene = new Scene();
            scene.backgroundColor = "#000";

            const over = new Label("GAME OVER");
            over.color = "#fff";
            over.x = 80;
            over.y = 120;
            scene.addChild(over);

            const result = new Label("Score: " + score);
            result.color = "#fff";
            result.x = 100;
            result.y = 160;
            scene.addChild(result);

            const restart = new Label("Tap to Restart");
            restart.color = "#fff";
            restart.x = 80;
            restart.y = 200;
            scene.addChild(restart);

            scene.ontouchend = function () {
                core.replaceScene(createGameScene());
            };

            return scene;
        }

        // START
        core.replaceScene(createGameScene());
    };

    core.start();
};