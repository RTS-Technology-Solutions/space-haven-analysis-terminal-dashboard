/**
 * 
 * 
 * 
 *                            ⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⡀
 *                        ⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣀
 *                     ⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀
 *                   ⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄
 *                 ⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆
 *               ⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀
 *              ⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧
 *            ⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
 *           ⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
 *          ⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
 *         ⢀⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⣿⣿⣿⣿⣿⣿⣿
 *        ⢀⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿
 *       ⢀⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⢀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣄⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿
 *      ⢀⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⢿⣿⣿⣿
 *     ⢀⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⢿⣿⣿
 *    ⢀⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⢸⣿
 *   ⢠⣿⣿⣿⣿⣿⡇⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⣿
 *   ⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⢸
 *  ⢸⣿⣿⣿⣿⣿⣿⠀⠀⠀⢸⣿⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⢿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⢸
 *  ⢸⣿⣿⣿⣿⣿⣿⠀⠀⠀⢸⣿⣿⣿⣿⠏⠀⠀⠀⢀⣴⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣦⡀⠀⠀⠹⣿⣿⣿⣿⣿⣿⠀⠀⠀⣼
 *  ⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠸⣿⣿⣿⠏⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠹⣿⣿⣿⣿⡟⠀⠀⠀⣿
 *  ⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⣿⣿⡟⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⢻⣿⣿⣿⠁⠀⠀⢀⣿
 *  ⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⢹⣿⡇⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⣿⣿⡏⠀⠀⠀⢸⣿
 *  ⢿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠸⣿⡇⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⣿⣿⠁⠀⠀⠀⣾⣿
 *  ⢸⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⣿⣷⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⣿⡇⠀⠀⠀⢰⣿⣿
 *   ⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⢹⣿⡄⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⢠⣿⠀⠀⠀⠀⣿⣿⣿
 *   ⢹⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠈⣿⣧⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⣼⡏⠀⠀⠀⢀⣿⣿⡇
 *    ⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠘⣿⣧⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠀⠀⠀⠀⣼⡿⠀⠀⠀⠀⣼⣿⣿
 *    ⠈⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠸⣿⣧⡀⠀⠀⠀⠀⠈⠛⠿⢿⣿⣿⣿⣿⣿⡿⠿⠋⠀⠀⠀⠀⠀⣰⣿⠇⠀⠀⠀⣰⣿⣿⡟
 *     ⢻⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⢿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠀⠀⠀⣰⣿⣿⣿⠃
 *      ⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀⠈⢿⣿⣷⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣾⣿⡿⠁⠀⠀⣰⣿⣿⣿⡟
 *       ⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⡀⠀⠀⠀⠙⢿⣿⣿⣶⣤⣀⣀⠀⠀⠀⠀⠀⠀⢀⣀⣠⣴⣾⣿⡿⠋⠀⠀⠀⣠⣿⣿⣿⣿⠃
 *         ⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠈⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠋⠁⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⠟
 *          ⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣿⣿⣿⣿⣿⣿⠟⠁
 *            ⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣤⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣴⣾⣿⣿⣿⣿⣿⣿⣿⡿⠋
 *              ⠈⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁
 *                 ⠉⠛⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠋⠁
 *                      ⠉⠙⠛⠛⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠛⠛⠋⠉
 * 
 * 
 * ═══════════════════════════════════════════════════════════════════════════════════
 *                        💩 THE ORIGIN STORY OF S.H.A.T. 💩
 * ═══════════════════════════════════════════════════════════════════════════════════
 * 
 * This site originated out of my gameplay when one of my crew was left out in space 
 * too long and literally had the status of "💩" (poop emoji) with, IIRC, a negative 
 * status condition of "shat themselves". 
 * 
 * I found it exceedingly hilarious, then wondered what other statuses were awaiting me, 
 * wanted a better way to understand the game, and well, here we are.
 * 
 * Thank you for visiting.
 * 
 * P.S. - Yes, S.H.A.T. stands for "Space Haven Analysis Terminal", but the acronym 
 * was absolutely intentional. When life gives you space station bathroom emergencies, 
 * you build a whole damn analytics platform around it.
 * 
 * P.P.S. - If you're reading this, you either:
 *   1. Are a fellow developer doing code review (hi! 👋)
 *   2. Got curious and dug into the source (I respect that)
 *   3. Accidentally scrolled way too far in your browser dev tools
 * 
 * Either way, I hope this made you smile. Space Haven is an incredible game, 
 * and this tool is my love letter to the community and the developers at Bugbyte.
 * 
 * May your oxygen always be plentiful, your crew always well-fed, 
 * and your toilets always functional.
 * 
 * - Patrick Snyder
 *   Software Engineer, Data Analyst, and Occasional Space Janitor
 *   RTS Technology & Solutions LLC
 *   June 2026
 * 
 * ═══════════════════════════════════════════════════════════════════════════════════
 * 
 */

// This file intentionally left empty except for the easter egg above.
// Sometimes the best code is the code that makes you laugh.

export {}
