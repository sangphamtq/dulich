import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(" ")[1]

    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server misconfiguration: JWT_SECRET not set" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}
