import { NextResponse } from "next/server";
import { sheets } from "@/lib/googleSheets";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, name } = body;

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: "Sheet1!A:D",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [
                    [
                        email,
                        name || "",
                        new Date().toISOString(),
                        "website",
                    ],
                ],
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Newsletter subscribe error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}