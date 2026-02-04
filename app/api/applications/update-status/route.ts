import { type NextRequest, NextResponse } from "next/server"
import { updateApplicationStatus } from "@/lib/data/applications"
import { addVerificationHistory } from "@/lib/data/verification"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { applicationId, status, userId, reason } = body

    if (!applicationId || !status || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const updated = await updateApplicationStatus(applicationId, status, userId, reason)

    if (updated) {
      // Add to verification history
      await addVerificationHistory(
        applicationId,
        userId,
        status === "approved"
          ? "approve"
          : status === "rejected"
            ? "reject"
            : status === "registered"
              ? "register"
              : "update",
        "application",
        applicationId,
        reason,
      )

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to update application status" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating application status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
