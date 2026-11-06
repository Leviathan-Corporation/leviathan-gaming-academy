import Link from "next/link";
import {requireAdmin} from "@/lib/admin";
import {AdminShell} from "@/components/admin-shell";
import {RecordedVideoManager} from "@/components/recorded-video-manager";
export default async function CourseVideos({params}:{params:Promise<{id:string}>}) {
 const {id}=await params; const s=await requireAdmin();
 const {data:course}=await s.from("courses").select("id,title,game").eq("id",id).single();
 if(!course) return <AdminShell title="COURSE VIDEOS"><p>Course not found.</p></AdminShell>;
 const {data:parts}=await s.from("course_parts").select("*").eq("course_id",id).order("sort_order");
 const {data:videos}=await s.from("course_videos").select("*").eq("course_id",id).order("sort_order");
 return <AdminShell title="RECORDED VIDEO LESSONS"><div className="admin-panel-head"><div><p className="muted">{course.title} · {course.game}</p><p className="muted">Organize videos as standalone lessons or group them into parts.</p></div><Link className="btn secondary" href="/admin/courses">← Courses</Link></div><RecordedVideoManager courseId={id} initialParts={parts??[]} initialVideos={videos??[]}/></AdminShell>;
}
