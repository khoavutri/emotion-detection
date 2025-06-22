interface StatusIcon {
    emoji: string;
    color: string;
    text: string;
}

interface StatusIcons {
    [key: string]: StatusIcon;
}


export const statusIcons: StatusIcons = {
    default: { emoji: "😐", color: "#02c19c", text: "Chưa xác định" },
    neutral: { emoji: "😐", color: "#54adad", text: "Trung lập" },
    happy: { emoji: "😀", color: "#148f77", text: "Vui vẻ" },
    sad: { emoji: "😥", color: "#767e7e", text: "Buồn" },
    angry: { emoji: "😠", color: "#b64518", text: "Giận dữ" },
    fearful: { emoji: "😨", color: "#90931d", text: "Sợ hãi" },
    disgusted: { emoji: "🤢", color: "#1a8d1a", text: "Ghê tởm" },
    surprised: { emoji: "😲", color: "#1230ce", text: "Ngạc nhiên" },
};