import express from 'express';
import { TextChannel, Client, GatewayIntentBits  } from 'discord.js';

const app = express();
const port = Bun.env.PORT || 3000;


// ID của kênh mà bot sẽ gửi thông báo
const channelId: any = Bun.env.CHANNELID;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent]  });

client.on('ready', () => {
    console.log(`Logged in!`);
});

// Sự kiện khi có người chơi vào trò chơi
client.on('presenceUpdate', (oldPresence: any, newPresence: any) => {
    const member = newPresence.member;
    // Kiểm tra xem thành viên đang chơi game mới hay không
    if (newPresence.activities.length && newPresence.activities[0].type == '0' && oldPresence?.activities[0]?.type != '0') {
        const gameName = newPresence.activities[0].name;
        if(gameName == oldPresence?.activities[0]?.name) return
        const nickname = member?.nickname || member?.displayName;
        // const gameDetails = newPresence.activities[0].details || 'No details available';
        // const gameState = newPresence.activities[0].state || 'No state available';

        const message = `${nickname} Đã vào game ${gameName}`;
        console.log(`message---->`, message);
        const channel = client.channels.cache.get(channelId) as TextChannel | undefined;
        if (channel) {
            // channel.send(message);
        } else {
            console.log('Channel not found');
        }
    }
});

// Đăng nhập bot bằng token
client.login(Bun.env.TOKEN_DISCORD);

// Route để nhận thông tin từ trò chơi hoặc nguồn dữ liệu khác
app.use(express.json());
app.post('/game/update', (req, res) => {
    // Xử lý dữ liệu nhận được từ trò chơi

    // Ví dụ: Nếu dữ liệu là tên người chơi và trò chơi đang chơi
    const playerName = req.body.playerName as string;
    const gameName = req.body.gameName as string;

    // Gửi thông báo vào máy chủ Discord
    const message = `Người chơi ${playerName} đang chơi trò chơi ${gameName}`;
    const channel = client.channels.cache.get(channelId) as TextChannel | undefined;
    if (channel) {
        channel.send(message);
        res.status(200).send('Message sent to Discord server');
    } else {
        res.status(500).send('Failed to send message to Discord server');
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});