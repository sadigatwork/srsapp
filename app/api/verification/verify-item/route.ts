import { type NextRequest, NextResponse } from "next/server"
import { verifyItem } from "@/lib/data/verification"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemType, itemId, userId, notes } = body

    if (!itemType || !itemId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["education", "experience", "training", "document"].includes(itemType)) {
      return NextResponse.json({ error: "Invalid item type" }, { status: 400 })
    }

    const verified = await verifyItem(
      itemType as "education" | "experience" | "training" | "document",
      itemId,
      userId,
      notes,
    )

    if (verified) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to verify item" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error verifying item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
