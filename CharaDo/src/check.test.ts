
// テストケース
test("テストケース", () => {
	// 厳密比較
	expect(1).toBe(1);
	// 構造比較(オブジェクト等)
	expect(1).toEqual(1);
});

test("check", () => {
	console.log("OK");
});