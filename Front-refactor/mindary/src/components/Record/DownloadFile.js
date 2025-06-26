export const toDataURL = (url) => {
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      return URL.createObjectURL(blob);
    });
};

export const downloadFile = async (fullImageUrl, fileName = "download.png") => {
  // 먼저 HEAD 요청으로 이미지 존재 확인
  const check = await fetch(fullImageUrl, { method: "HEAD" });

  if (!check.ok) {
    alert("이미지가 존재하지 않아 다운로드할 수 없습니다.");
    return;
  }

  // 실제 이미지 GET
  const response = await fetch(fullImageUrl);
  if (!response.ok) {
    alert("다운로드에 실패했습니다.");
    return;
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // 메모리 누수 방지용 URL 해제
  URL.revokeObjectURL(url);
};
